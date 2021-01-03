export interface Faculty {
  id: number | null;
  name: string;
}

export interface Group {
  id: number | null;
  course: string;
  group_number: string;
  faculty: Faculty | null;
}

export interface User {
  id: number | null;
  user_id: string;
  faculty: Faculty | null;
  group: Group | null;
}

export interface Shedule {
  id: number | null;
  group: Group | null;
  shedule: string;
}