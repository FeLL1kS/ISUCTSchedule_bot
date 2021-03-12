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
import Source from './Source';

@Table({
    tableName: 'users',
    timestamps: true,
    paranoid: true,
})
export default class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column(DataType.INTEGER)
    public id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    public firstname!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    public lastname!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    public username!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    public lang!: string;

    @AllowNull(false)
    @ForeignKey(() => Source)
    @Column(DataType.INTEGER)
    public sourceId!: number;

    @BelongsTo(() => Source)
    public source!: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    public sourceUserId!: number;

    @AllowNull(true)
    @ForeignKey(() => Group)
    @Column(DataType.INTEGER)
    public groupId!: number;

    @BelongsTo(() => Group)
    public group!: number;
}
