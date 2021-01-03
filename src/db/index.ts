import { Pool } from 'pg';

let pool : Pool;

if (process.env.NODE_ENV === 'development') {
  pool = new Pool({
    user: 'postgres',
    password: '123',
    host: 'localhost',
    port: 5432,
    database: 'telegram'
  })
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

export default pool;