import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { ArticleEntity } from './article.entity'


//浏览记录表
@Entity({ name: 'view_log' })
export class ViewLogEntity {
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