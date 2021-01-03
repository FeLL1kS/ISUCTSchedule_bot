import { Pool } from 'pg';

export default new Pool({
  user: 'postgres',
  password: '123',
  host: 'localhost',
  port: 5432,
  database: 'telegram'
})
