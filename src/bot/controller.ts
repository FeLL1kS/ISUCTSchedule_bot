import { Telegraf } from 'telegraf';
import { formKeyboard } from './helpers';
import { getAllFaculties, getFacultyByName } from './repositories/facultyRepository';
import { getAllGroupsByFacultyId, getGroupByCourseAndGroupNumber } from './repositories/groupRepository';
import { getShedule } from './repositories/lessonRepository';
import { createUser, getUserByTelegramId, updateUser } from './repositories/userRepository';

export const bot = new Telegraf(process.env.TOKEN as string);

function init() {
  bot.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = +new Date() - +start;
    const response = JSON.stringify({
      id: ctx.message?.from?.id,
      firstName: ctx.message?.from?.first_name,
      lastName: ctx.message?.from?.last_name,
      username: ctx.message?.from?.username,
      message: ctx.message?.text,
      isSticker: ctx.message?.sticker ? true : false,
      responseTime: `${ms}ms`,
    });
    console.log(response);
  });

  bot.on('text', async (ctx) => {
    // Получение пользователя
    let user = await getUserByTelegramId(ctx.message?.from?.id);
    if (!user) {
      if (ctx && ctx.message && ctx.message.from) {
        user = {
          id: 0,
          user_id: `${ctx.message.from.id}`,
          faculty: null,
          group: null,
        };
        await createUser(user);
      };
    };

    // Сменить группу
    if (user && ctx.message?.text === 'Сменить группу') {
      user.group = null;
      await updateUser(user);
    }
    
    // Сменить факультет
    if (user && ctx.message?.text === 'Сменить факультет') {
      user.group = null;
      user.faculty = null;
      await updateUser(user);
    }
  

    // Выбор факультета
    if (user && user.faculty === null) {
      let faculties = (await getAllFaculties()).rows.map(faculty => faculty['name']);

      if (faculties.indexOf(ctx.message?.text) !== -1) {
        user.faculty = await getFacultyByName(ctx.message?.text);
        await updateUser(user);
      } else {
        ctx.reply('Выберите ваш факультет', {
          reply_markup: {
            keyboard: formKeyboard(faculties, 2),
            one_time_keyboard: true,
            remove_keyboard: true,
            resize_keyboard: true,
          },
        });
        return;
      }
    };


    // Выбор группы
    if (user && user.group === null && user.faculty && user.faculty.id && ctx.message?.text) {
      let groups = (await getAllGroupsByFacultyId(user.faculty.id)).rows.map(group => group['course'] + '-' + group['group_number']);
      if (groups.indexOf(ctx.message?.text) !== -1) {
        let [course, groupNumber] = ctx.message.text.split('-');
        let group = await getGroupByCourseAndGroupNumber(course, groupNumber)
        user.group = group;
        await updateUser(user);
      } else {
        ctx.reply('Выберите вашу группу', {
          reply_markup: {
            keyboard: formKeyboard(groups.sort(), 6),
            one_time_keyboard: true,
            remove_keyboard: true,
            resize_keyboard: true,
          }
        });
        return;
      }
    }

    // Запрос расписания на сегодня
    if (user && user.group && user.group.id !== null && ctx.message?.text === 'Расписание') {
      ctx.reply(await getShedule(user.group?.id), {
        reply_markup: {
          keyboard: formKeyboard([
            'Расписание',
            'Расписание на завтра',
            'Сменить группу',
            'Сменить факультет',
          ], 2),
          one_time_keyboard: true,
          remove_keyboard: true,
          resize_keyboard: true,
        },
      })
      return;
    }

    // Запрос расписания на завтра
    if (user && user.group && user.group.id !== null &&  ctx.message?.text === 'Расписание на завтра') {
      ctx.reply(await getShedule(user.group?.id, 1), {
        reply_markup: {
          keyboard: formKeyboard([
            'Расписание',
            'Расписание на завтра',
            'Сменить группу',
            'Сменить факультет',
          ], 2),
          one_time_keyboard: true,
          remove_keyboard: true,
          resize_keyboard: true,
        },
      })
      return;
    }

    ctx.reply(`Добро пожаловать. Теперь вы можете удобно просматривать расписание на сегодня (нажав или написав "Расписание"), либо на завтра (нажав или написав "Расписание на завтра").`,{
      reply_markup: {
        keyboard: formKeyboard([
          'Расписание',
          'Расписание на завтра',
          'Сменить группу',
          'Сменить факультет',
        ], 2),
        one_time_keyboard: true,
        remove_keyboard: true,
        resize_keyboard: true,
      },
    })
  });
};

const BotController = {init};
export default BotController;