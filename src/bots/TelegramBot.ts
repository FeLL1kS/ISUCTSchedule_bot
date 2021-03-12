import { Application, NextFunction } from 'express';
import { Telegraf, Scenes, Context, session } from 'telegraf';

import { IBot, BotBase } from '../core';
import { Sources, Tables } from '../enum';
import { logger, m } from '../utils';
import { User } from '../db/models';

type KeyboardButtons = {text: string}[][];

interface MyContext extends Context {
    user: User;
    scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
    wizard: Scenes.WizardContextWizard<MyContext>;
}

export default class TelegramBot extends BotBase implements IBot {
    private bot: Telegraf<MyContext>;
    private readonly endpoint: string = process.env.TG_ENDPOINT || '/telegram';

    constructor() {
        super(Sources.Telegram);

        this.bot = new Telegraf<MyContext>(process.env.TG_BOT_TOKEN || '');
    }

    public bind(app: Application) {
        const welcomeWizard: any = new Scenes.WizardScene<MyContext>(
            'welcome-wizard',
            async (ctx: MyContext): Promise<unknown> => {
                (ctx.wizard.state as any).data = {};

                const universities: string[] = await this.getList(Tables.University, {});
                await ctx.reply(
                    m[ctx.user.lang].wizard.welcome.university,
                    this.buildReplyMarkup(universities, 1)
                );
                return ctx.wizard.next();
            },
            async (ctx: MyContext): Promise<unknown> => {
                const universityId: number | null = await this.getIdByName(
                    Tables.University,
                    (ctx.message as any)?.text
                );

                if (!universityId) {
                    return ctx.wizard.back();
                }

                (ctx.wizard.state as any).data.universityId = universityId;

                const faculties: string[] = await this.getList(Tables.Faculty, { universityId });
                await ctx.reply(
                    m[ctx.user.lang].wizard.welcome.faculty,
                    this.buildReplyMarkup(faculties, 1)
                );
                return ctx.wizard.next();
            },
            async (ctx: MyContext): Promise<unknown> => {
                const facultyId: number | null = await this.getIdByName(
                    Tables.Faculty,
                    (ctx.message as any)?.text,
                    {
                        universityId: (ctx.wizard.state as any).data.universityId,
                    }
                );

                if (!facultyId) {
                    return ctx.wizard.back();
                }

                (ctx.wizard.state as any).data.facultyId = facultyId;

                const groups: string[] = await this.getList(Tables.Group, { facultyId });
                await ctx.reply(
                    m[ctx.user.lang].wizard.welcome.group,
                    this.buildReplyMarkup(groups, 2)
                );
                return ctx.wizard.next();
            },
            async (ctx: MyContext): Promise<unknown> => {
                const groupId: number | null = await this.getIdByName(
                    Tables.Group,
                    (ctx.message as any)?.text,
                    {
                        facultyId: (ctx.wizard.state as any).data.facultyId,
                    }
                );

                if (!groupId) {
                    return ctx.wizard.back();
                }

                ctx.user.groupId = groupId;
                await ctx.user.save();

                await ctx.reply(
                    m[ctx.user.lang].wizard.welcome.done,
                    this.buildReplyMarkup()
                );
                return await ctx.scene.leave();
            }
        );

        const stage = new Scenes.Stage<MyContext>([ welcomeWizard ]);

        this.bot.use(async (ctx: MyContext, next: NextFunction) => {
            if (ctx.message?.from?.id) {
                let user: User | null = await this.getUser(ctx.message.from.id);
                if (!user) {
                    user = await this.createUser(
                        ctx.message.from.id,
                        ctx.message.from.first_name,
                        ctx.message.from.last_name,
                        ctx.message.from.username,
                        ctx.message.from.language_code
                    );
                }

                ctx.user = user;
            }
            return next();
        });

        this.bot.use(async (ctx: MyContext, next: NextFunction) => {
            const time: number = Date.now();
            await next();
            logger.debug('Got request %s', {
                source: 'telegram',
                userId: ctx.user.id,
                message: (ctx.message as any).text || null,
                responseTime: `${Date.now() - time}ms`,
            });
        });
        this.bot.use(session());
        this.bot.use(stage.middleware());

        this.bot.start(async (ctx: MyContext): Promise<unknown> => ctx.scene.enter('welcome-wizard'));

        this.bot.hears(
            m.ru.triggers.configure,
            async (ctx: MyContext): Promise<unknown> => ctx.scene.enter('welcome-wizard')
        );

        this.bot.hears(
            m.ru.triggers.schedule,
            async (ctx: MyContext) => {
                const schedule: string = await this.getSchedule(ctx.user.groupId);
                await ctx.reply(
                    schedule,
                    this.buildReplyMarkup()
                );
            }
        );

        app.use(this.bot.webhookCallback(this.endpoint));
        const webhookEndpoint: string = (process.env.SV_APP_URL || '') + this.endpoint;
        this.bot.telegram.setWebhook(webhookEndpoint);
        logger.info('telegram webhook set at %s', webhookEndpoint);
    }

    private buildReplyMarkup(
        data: string[] = [
            m.ru.triggers.schedule,
            m.ru.triggers.configure,
        ],
        cols = 2
    ): any{
        const keyboard: KeyboardButtons = [];
        while (data.length > 0) {
            keyboard.push(data.splice(0, cols).map((text: string) => ({ text })));
        }
        return {
            // eslint-disable-next-line camelcase
            reply_markup: {
                keyboard,
                // eslint-disable-next-line camelcase
                one_time_keyboard: true,
                // eslint-disable-next-line camelcase
                remove_keyboard: true,
                // eslint-disable-next-line camelcase
                resize_keyboard: true,
            },
        };
    }
}
