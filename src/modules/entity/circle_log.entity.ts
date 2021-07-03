import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import {CircleEntity } from './circle.entity'


//用户与车友圈关系表
@Entity({ name: 'circle_log' })
export class CircleLogEntity {
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

    @Column({ type: 'datetime' })
    update_time: Date;

    @Column({ type: 'datetime' })
    delete_time: Date;
}