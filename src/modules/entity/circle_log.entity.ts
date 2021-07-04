import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import {CircleEntity } from './circle.entity'


//用户与车友圈关系表
@Entity({ name: 'circle_log' })
export class CircleLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(
    //     () => UserEntity,
    //     user => user.circles,
    // )
    // user_id:number

    // @ManyToOne(
    //     () => CircleEntity,
    //     circle => circle.users,
    // )
    // community_id:number
    @Column()
    user_id:number

    @Column()
    community_id:number

    @Column({ type: 'datetime' })
    create_time: Date;

    @Column({ type: 'datetime' })
    update_time: Date;

    @Column({ type: 'datetime' })
    delete_time: Date;
}