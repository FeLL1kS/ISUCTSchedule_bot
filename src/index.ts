import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import BotController, { bot } from './bot/controller'
import DBController from './db/init'

DBController.init();
const app = express();

BotController.init();
app.use(bot.webhookCallback(`/bot${process.env.TOKEN}`));
bot.telegram.setWebhook(`${process.env.APP_URL}/bot${process.env.TOKEN}`);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000);