import db from "../../db";
import { API_GROUP, Group } from "../interfaces";
import { getFacultyById } from "./facultyRepository";

export const getAllGroupsByFacultyId = async (facultyId: number) => {
  return await db.query(`SELECT * FROM groups WHERE faculty_id = '${facultyId}'`);
}

export const getGroupById = async (id: number) => {
  const response = await db.query(`SELECT * FROM groups WHERE id = ${id}`);
  if (response.rowCount > 0 && id !== null) {
    const group: Group = {
      id: response.rows[0]['id'],
      course: response.rows[0]['course'],
      group_number: response.rows[0]['group_number'],
      faculty: await getFacultyById(response.rows[0]['faculty_id']),
    };
    return group;
  } else {
    return null;
  }
} 

export const getGroupByCourseAndGroupNumber = async (course: string, group_number: string) => {
  const response = await db.query(`SELECT * FROM groups WHERE course = '${course}' AND group_number = '${group_number}'`);
  if (response.rowCount > 0) {
    const group: Group = {
      id: response.rows[0]['id'],
      course: response.rows[0]['course'],
      group_number: response.rows[0]['group_number'],
      faculty: await getFacultyById(response.rows[0]['faculty_id']),
    };
    return group;
  } else {
    return null;
  }
}

export const addGroupToDb = async (group: API_GROUP, facultyId: string) => {
  try {
    let [ course, group_number ]  = group.name.split('-');
    await db.query(`INSERT INTO groups(course, group_number, faculty_id) VALUES('${course}', '${group_number}', '${facultyId}')`);

    const groupId = (await db.query(`SELECT * FROM groups WHERE course='${course}' AND group_number='${group_number}'`)).rows[0]['id'];
    return groupId;
  } catch {
    console.log('Не удалось добавить group в таблицу groups');
  }
}