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
import User from './User';

@Table({
    tableName: 'sources',
    timestamps: false,
})
export default class Source extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column(DataType.INTEGER)
    public id!: number;

    @AllowNull(false)
    @Unique(true)
    @Column(DataType.STRING)
    public name!: string;

    @HasMany(() => User)
    public users!: User[];
}
