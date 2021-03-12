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
import Group from './Group';
import University from './University';

@Table({
    tableName: 'faculties',
    timestamps: false,
})
export default class Faculty extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column(DataType.INTEGER)
    public id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    public name!: string;

    @ForeignKey(() => University)
    @Column(DataType.INTEGER)
    public universityId!: number;

    @BelongsTo(() => University)
    public university!: University;

    @HasMany(() => Group)
    public groups!: Group[];
}
