import db from "../../db";
import { Faculty } from "../interfaces";

export const getFacultyById = async (id: number) => {
  const response = await db.query(`SELECT * FROM faculties WHERE id = ${id}`);
  if (response.rowCount > 0 && id !== null) {
    const faculty: Faculty = {
      id: response.rows[0]['id'],
      name: response.rows[0]['name'],
    };
    return faculty;
  } else {
    return null;
  }
}

export const getFacultyByName = async (name: string | undefined) => {
  const response = await db.query(`SELECT * FROM faculties WHERE name = '${name}'`);
  if (response.rowCount > 0 && name !== null) {
    const faculty: Faculty = {
      id: response.rows[0]['id'],
      name: response.rows[0]['name'],
    };
    return faculty;
  } else {
    return null;
  }
}

export const addFacultyToDb = async (name: string) => {
  try {
    await db.query(`INSERT INTO faculties(name) VALUES('${name}')`);

    const facultyId = (await db.query(`SELECT * FROM faculties WHERE name = '${name}'`)).rows[0]['id'];
    
    return facultyId;
  } catch {
    console.log('Не удалось добавить faculty в таблицу faculties');
  }
}

export const getAllFaculties = async () => {
  return await db.query(`SELECT * FROM faculties`);
};