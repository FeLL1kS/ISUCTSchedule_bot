CREATE TABLE Faculties(
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
);