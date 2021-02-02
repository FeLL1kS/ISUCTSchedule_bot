import db from "../../db";
import { User } from "../interfaces";
import { getFacultyById } from "./facultyRepository";
import { getGroupById } from "./groupRepository";

export const getUserByTelegramId = async (id: number | undefined) => {
  const response = await db.query(`SELECT * FROM users WHERE user_id = '${id}'`);
  
  if (response.rowCount > 0 && id !== null) {
    const user: User = {
      id: response.rows[0]['id'],
      user_id: response.rows[0]['user_id'],
      faculty: await getFacultyById(response.rows[0]['faculty_id']),
      group: await getGroupById(response.rows[0]['group_id']),
    };
    return user;
  } else {
    return null;
  }
};

export const createUser = async (user: User) => {
  await db.query(`INSERT INTO users(user_id, faculty_id, group_id) VALUES('${user.user_id}', ${user.faculty?.id || null}, ${user.group?.id || null})`);
}

export const updateUser = async (user: User) => {
  await db.query(`UPDATE users SET user_id='${user.user_id}', faculty_id=${user.faculty?.id || null}, group_id=${user.group?.id || null} WHERE id=${user.id}`);
}