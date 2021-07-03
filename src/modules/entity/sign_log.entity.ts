import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import {CircleEntity } from './circle.entity'

//用户圈子签到表
@Entity({ name: 'sign_log' })
export class SignLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(
        () => UserEntity,
        user => user.id,
    )
    user_id:number

    @OneToOne(
        () => CircleEntity,
        circle => circle.id,
    )
    community_id:number

    @Column({ type: 'datetime' })
    create_time: Date;
}