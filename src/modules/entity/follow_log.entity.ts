import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne,ManyToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';

//图片表
@Entity({ name: 'follow_log' })
export class FollowLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    author_id: number;

    @Column({ type: 'datetime' })
    create_time: Date;

    @Column({ type: 'datetime' })
    update_time: Date;

    @Column({ type: 'datetime' })
    delete_time: Date;

}