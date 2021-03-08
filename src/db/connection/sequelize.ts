import * as models from '../models';
import { Sequelize } from 'sequelize-typescript';
import pg from 'pg';

pg.defaults.parseInt8 = true;

export const sequelize = new Sequelize(
  process.env.POSTGRES_DB || '',
  process.env.POSTGRES_USER || '',
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    dialect: 'postgres',
    models: Object.values(models) as any[],
    logging: process.env.POSTGRES_LOGGING === 'true',
  }
);
