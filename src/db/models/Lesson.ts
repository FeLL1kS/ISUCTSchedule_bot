import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import Group from './Group';

@Table({
    tableName: 'lessons',
    timestamps: false,
})
export default class Lesson extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column(DataType.INTEGER)
    public id!: number;

    @AllowNull(false)
    @ForeignKey(() => Group)
    @Column(DataType.INTEGER)
    public groupId!: number;

    @BelongsTo(() => Group)
    public group!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    public subject!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    public type!: string;

    @AllowNull(false)
    @Column(DataType.TIME)
    public timeStart!: Date;

    @AllowNull(false)
    @Column(DataType.TIME)
    public timeEnd!: Date;

    @AllowNull(false)
    @Column(DataType.DATEONLY)
    public dateStart!: Date;

    @AllowNull(false)
    @Column(DataType.DATEONLY)
    public dateEnd!: Date;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    public week!: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    public weekday!: number;

    @AllowNull(false)
    @Column(DataType.ARRAY(DataType.STRING))
    public audiences!: string[];

    @AllowNull(false)
    @Column(DataType.ARRAY(DataType.STRING))
    public teachers!: string[];
}
