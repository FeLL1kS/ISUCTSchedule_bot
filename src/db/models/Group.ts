import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import Faculty from './Faculty';
import Lesson from './Lesson';
import User from './User';

@Table({
    tableName: 'groups',
    timestamps: false,
})
export default class Group extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column(DataType.INTEGER)
    public id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    public name!: string;

    @ForeignKey(() => Faculty)
    @Column(DataType.INTEGER)
    public facultyId!: number;

    @BelongsTo(() => Faculty)
    public faculty!: Faculty;

    @HasMany(() => User)
    public users!: User[];

    @HasMany(() => Lesson)
    public lessons!: Lesson[];
}
