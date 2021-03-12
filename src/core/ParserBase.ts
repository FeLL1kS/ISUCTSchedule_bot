import { Faculty, Group } from '../db/models';
import Lesson from '../db/models/Lesson';
import { Universities } from '../enum';

export default abstract class ParserBase {
    constructor(protected readonly universityId: Universities) {}

    protected async getOrCreateFaculty(name: string): Promise<Faculty> {
        let faculty: Faculty | null = await Faculty.findOne({
            attributes: [ 'id' ],
            where: {
                universityId: this.universityId,
                name,
            },
        });

        if (!faculty) {
            faculty = await Faculty.create({
                universityId: this.universityId,
                name,
            });
        }

        return faculty;
    }

    protected async getOrCreateGroup(facultyId: number, name: string): Promise<Group> {
        let group: Group | null = await Group.findOne({
            attributes: [ 'id' ],
            where: {
                facultyId,
                name,
            },
        });

        if (!group) {
            group = await Group.create({
                facultyId,
                name,
            });
        }

        return group;
    }

    protected async setLessons(groupId: number, lessons: any[]): Promise<void> {
        await Lesson.destroy({
            where: {
                groupId,
            },
        });

        await Lesson.bulkCreate(lessons);
    }
}
