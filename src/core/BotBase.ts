import moment from 'moment';
import { Model, WhereOptions } from 'sequelize/types';

import { Faculty, Group, Lesson, University, User } from '../db/models';
import { Days, Sources, Tables, Weeks } from '../enum';
import { formatTime, logger, m } from '../utils';

export default class BotBase {
    constructor(protected readonly sourceId: Sources) {}

    protected async getUser(sourceUserId: number): Promise<User | null> {
        const user: User | null = await User.findOne({
            where: {
                sourceId: this.sourceId,
                sourceUserId,
            },
        });

        return user;
    }

    protected async createUser(
        sourceUserId: number,
        firstname: string,
        lastname?: string,
        username?: string,
        langCode?: string
    ): Promise<User> {
        const lang: string = langCode && m[langCode] ? langCode : m.default;

        const user: User = await User.create({
            sourceId: this.sourceId,
            sourceUserId,
            firstname,
            lastname,
            username,
            lang,
        });

        logger.info('User created: %o', user.toJSON());

        return user;
    }

    protected async getIdByName(table: Tables, name: string, where: WhereOptions = {}): Promise<number | null> {
        let model;
        switch (table) {
            case Tables.University:
                model = University;
                break;
            case Tables.Faculty:
                model = Faculty;
                break;
            case Tables.Group:
                model = Group;
                break;
        }
        const entity: Model | null = await model.findOne({
            attributes: ['id'],
            where: {
                name,
                ...where,
            },
        });
        return (entity as any)?.id;
    }

    protected async getList(table: Tables, where: WhereOptions): Promise<string[]> {
        let model;
        switch (table) {
            case Tables.University:
                model = University;
                break;
            case Tables.Faculty:
                model = Faculty;
                break;
            case Tables.Group:
                model = Group;
                break;
        }
        const entities: Model[] = await model.findAll({
            attributes: ['name'],
            where,
        });
        return entities.map((x: Model) => (x as any).name).sort();
    }

    protected async getSchedule(groupId: number, offset: number = 0): Promise<string> {
        let schedule: string = 'Выходной, можно отдохнуть';

        const momentDateTime: moment.Moment = moment().utcOffset(3);
        const week: number = momentDateTime.week() % 2 ? 1 : 2;
        const weekday: number = (momentDateTime.day() + offset) % 7;

        if (weekday === Days.Воскресенье) {
            return schedule;
        }

        schedule = `${Weeks[week]} неделя, ${Days[weekday]}\n\n`;

        const lessons: Lesson[] = await Lesson.findAll({
            where: {
                groupId,
                week,
                weekday,
            },
        });

        schedule = lessons.reduce((sched: string, lesson: Lesson): string => {
            sched += [
                [
                    lesson.subject,
                    lesson.audiences.join(', '),
                ],
                [
                    formatTime(lesson.timeStart) + '-' + formatTime(lesson.timeEnd),
                    lesson.type,
                ],
                [
                    lesson.teachers.join(', '),
                ],
            ].map((line: string[]): string => line.join(' | ')).join('\n');
            return sched + '\n\n';
        }, schedule);

        return schedule;
    }
}
