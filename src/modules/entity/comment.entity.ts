import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import {ArticleEntity } from './article.entity'


//评论表
@Entity({ name: 'comment' })
export class CommentEntity {
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
    
    @Column()
    pid:number;

    @Column({ type: 'longtext' })
    content:string;

    @Column()
    type:number;

    @Column()
    status:boolean;

    @Column({ type: 'datetime' })
    create_time: Date;

    @Column({ type: 'datetime' })
    update_time: Date;

    @Column({ type: 'datetime' })
    delete_time: Date;

}