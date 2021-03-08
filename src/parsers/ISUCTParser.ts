import fetch from 'node-fetch';

import { IParser, ParserBase } from '../core';
import { Faculty, Group } from '../db/models';
import { Universities } from '../enum';

interface IHasName {
    name: string;
}

export default class ISUCTParser extends ParserBase implements IParser {
    constructor() {
        super(Universities.ISUCT);
    }

    public async parse(): Promise<void> {
        const url: string = process.env.ISUCT_API_URL || '';
        if (!url) {
            throw new Error('env ISUCT_API_URL is undefined or empty');
        }

        const response: any = await fetch(url);

        if (!response.ok) {
            throw new Error('Cant get schedule');
        }

        const json = await response.json();

        for (const faculty of json.faculties) {
            if (!faculty.name) {
                continue;
            }

            const facultyEntity: Faculty = await this.getOrCreateFaculty(faculty.name);
            for (const group of faculty.groups) {
                const groupEntity: Group = await this.getOrCreateGroup(facultyEntity.id, group.name);
                const lessons = group.lessons.map((lesson: any) => ({
                    groupId: groupEntity.id,
                    subject: lesson.subject,
                    type: lesson.type,
                    timeStart: this.getTime(lesson.time.start),
                    timeEnd: this.getTime(lesson.time.end),
                    dateStart: this.getDate(lesson.date.start),
                    dateEnd: this.getDate(lesson.date.end),
                    week: lesson.date.week,
                    weekday: lesson.date.weekday,
                    audiences: lesson.audiences.map((x: IHasName) => x.name),
                    teachers: lesson.teachers.map((x: IHasName) => x.name),
                }));

                await this.setLessons(groupEntity.id, lessons);
            }
        }
    }

    private getDate(date: string): Date {
        const [ days, months, years ] = date.split('.');
        return new Date(Number(years), Number(months) - 1, Number(days));
    }

    private getTime(time: string): Date {
        const [ hours, minutes ] = time.split(':');
        return new Date(0, 0, 0, Number(hours), Number(minutes));
    }
}
