import { Telegraf } from 'telegraf';
import { FACULTIES } from './const'
import { formKeyboard } from './helpers'
import db from '../db'
import { FMTDI } from './const'

export const bot = new Telegraf(process.env.token as string);

function init() {
  bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = +new Date() - +start
    const response = JSON.stringify({
      id: ctx.message?.from?.id,
      firstName: ctx.message?.from?.first_name,
      lastName: ctx.message?.from?.last_name,
      username: ctx.message?.from?.username,
      message: ctx.message?.text,
      isSticker: ctx.message?.sticker ? true : false,
      responseTime: `${ms}ms`,
    })
    console.log(response)
  })

  bot.hears([...FACULTIES], async ctx => {
    const user = await db.query(`SELECT * FROM users WHERE user_id = '${ctx.message?.from?.id}'`);
    let allFaculties = await db.query(`SELECT * FROM faculties`);
    allFaculties.rows.map(async faculty => {
      if (faculty['name'] === ctx.message?.text) {
        await db.query(`UPDATE users SET faculty_id='${faculty['id']}' WHERE user_id='${user.rows[0]['user_id']}'`)
      }
    })
  })

  bot.on('text', async (ctx) => {
    let user = await db.query(`SELECT * FROM users WHERE user_id = '${ctx.message?.from?.id}'`);
    if (user.rowCount === 0) {
      user = await db.query(`INSERT INTO users(user_id) VALUES('${ctx.message?.from?.id}')`);
    }
    if (user.rowCount || user.rows[0]['faculty_id'] === null) {
        ctx.reply('Выберите ваш факультет', {
        reply_markup: {
          keyboard: formKeyboard(FACULTIES, 2),
          remove_keyboard: true,
          resize_keyboard: true,
        }
      })
    }
  })
}

const BotController = {init};
export default BotController;