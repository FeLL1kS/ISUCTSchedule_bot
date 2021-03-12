import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { logger } from './utils';
import { sequelize } from './db/connection/sequelize';
import { IBot } from './core';
import api from './api';
import * as bots from './bots';

async function main() {
    await sequelize.authenticate();
    const app: Application = express();

    for (const botName of Object.keys(bots)) {
        const bot: IBot = new (bots[botName])();
        await bot.bind(app);
        logger.info('Bot %s ready', botName);
    }

    app.use('/api/', api);
    app.get('/', (_req: Request, res: Response): Response => res.send('Hello world'));

    const port: number = Number(process.env.SV_PORT) || 5000;
    app.listen(port, () => {
        logger.info('Server started on port %d', port);
    });
}

main();
