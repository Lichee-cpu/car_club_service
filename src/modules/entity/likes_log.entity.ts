import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import {ArticleEntity } from './article.entity'


//点赞表
@Entity({ name: 'likes_log' })
export class LikesLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id:number

    @Column()
    article_id:number

    @Column({ type: 'datetime' })
    create_time: Date;

    @Column({ type: 'datetime' })
    update_time: Date;

    @Column({ type: 'datetime' })
    delete_time: Date;
}