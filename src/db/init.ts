import db from './';
import { ISUCT_SHEDULE_API } from '../bot/const'
import fetch from 'node-fetch';
import { API_FACULTY, API_GROUP, API_LESSON } from '../bot/interfaces';
import { addFacultyToDb } from '../bot/repositories/facultyRepository';
import { addGroupToDb } from '../bot/repositories/groupRepository';
import { addLessonToDb } from '../bot/repositories/lessonRepository';

async function init() {
  const tables = await db.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE table_type='BASE TABLE' AND table_catalog='${process.env.TABLE_CATALOG}' AND table_schema='public'`);
  
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
        faculty_id INTEGER,
        FOREIGN KEY (faculty_id) REFERENCES Faculties (id)
      );
      
      CREATE TABLE Users(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        faculty_id INTEGER,
        group_id INTEGER,
        FOREIGN KEY (faculty_id) REFERENCES Faculties (id),
        FOREIGN KEY (group_id) REFERENCES Groups (id)
      );

      CREATE TABLE Lessons(
        id SERIAL PRIMARY KEY,
        group_id INTEGER,
        FOREIGN KEY (group_id) REFERENCES Groups (id),
        subject VARCHAR(255),
        type VARCHAR(255),
        time VARCHAR(255),
        date VARCHAR(255),
        weekday INTEGER,
        week INTEGER,
        audiences VARCHAR(255),
        teachers VARCHAR(255)
      );`
    )

    let response = await fetch(ISUCT_SHEDULE_API);

    if (response.ok) {
      let json = await response.json();

      json['faculties'].forEach(async (faculty: API_FACULTY) => {
        if (faculty.name !== "") {
          let facultyId = await addFacultyToDb(faculty.name);
          faculty.groups.map(async (group: API_GROUP) => {
              let groupId = await addGroupToDb(group, facultyId);
              group.lessons.map(async (lesson: API_LESSON) => {
                await addLessonToDb(lesson, groupId);
              })  
          })
        }
      });
    }
  }
}

const DBController = {init};
export default DBController;