import db from './';
import { FACULTIES } from '../bot/const'

async function init() {
  const tables = await db.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE table_type='BASE TABLE' AND table_catalog='telegram' AND table_schema='public'`);
  
  if (tables.rowCount === 0) {
    await db.query(
      `CREATE TABLE Faculties(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)
      );
      
      CREATE TABLE Groups(
        id SERIAL PRIMARY KEY,
        course VARCHAR(255),
        group_number VARCHAR(255),
        faculty VARCHAR(255)
      );
      
      CREATE TABLE Users(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        faculty_id INTEGER,
        group_id INTEGER,
        FOREIGN KEY (faculty_id) REFERENCES Faculties (id),
        FOREIGN KEY (group_id) REFERENCES Groups (id)
      );
      
      CREATE TABLE Shedule(
        id SERIAL PRIMARY KEY,
        group_id INTEGER,
        FOREIGN KEY (group_id) REFERENCES Groups (id),
        Shedule TEXT
      );`
    )
    FACULTIES.map(async faculty => {
      await db.query(`INSERT INTO faculties(name) VALUES('${faculty}')`)
    })
  }
}

const DBController = {init};
export default DBController;