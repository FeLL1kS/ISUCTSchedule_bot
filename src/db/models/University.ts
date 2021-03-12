import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';
import Faculty from './Faculty';

@Table({
    tableName: 'universities',
    timestamps: false,
})
export default class University extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column(DataType.INTEGER)
    public id!: number;

    @AllowNull(false)
    @Unique(true)
    @Column(DataType.STRING)
    public name!: string;

    @HasMany(() => Faculty)
    public faculties!: Faculty[];
}
