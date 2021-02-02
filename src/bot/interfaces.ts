export interface Faculty {
  id: number;
  name: string;
}

export interface Group {
  id: number;
  course: string;
  group_number: string;
  faculty: Faculty | null;
}

export interface User {
  id: number;
  user_id: string;
  faculty: Faculty | null;
  group: Group | null;
}

export interface Shedule {
  id: number;
  group: Group | null;
  shedule: string;
}

export interface Lesson {
  id: number;
  subject: string,
  type: string,
  time: string,
  date: string,
  weekday: number;
  week: number;
  audiences: string;
  teachers: string,
}

export interface API_LESSON {
  subject: string,
  type: string,
  time: { start: string, end: string },
  date: { start: string, end: string, weekday: number, week: number },
  audiences: Array<{ name: string }>,
  teachers: Array<{ name: string}>,
}

export interface API_GROUP {
  name: string,
  lessons: Array<API_LESSON>, 
}

export interface API_FACULTY {
  name: string,
  groups: Array<API_GROUP>,
}