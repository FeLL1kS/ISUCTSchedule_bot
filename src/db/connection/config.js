// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();

const {
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;

module.exports = {
  dialect: 'postgres',
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  port: POSTGRES_PORT,
  logging: false,
  define: {
    freezeTableName: true,
  },
  sync: false,
};
