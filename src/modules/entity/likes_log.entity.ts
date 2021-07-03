import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import {ArticleEntity } from './article.entity'


//点赞表
@Entity({ name: 'likes_log' })
export class LikesLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(
        () => UserEntity,
        user => user.id,
    )
    user_id:number

    @OneToOne(
        () => ArticleEntity,
        article => article.id,
    )
    article_id:number

    @Column({ type: 'datetime' })
    create_time: Date;
}