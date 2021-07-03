import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';
//圈子表
@Entity({ name: 'circle' })
export class CircleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('varchar')
    img_path: string;

    @Column()
    active_num:number;

    @Column()
    all_num:number;

    @Column()
    community_content_num:number;

    @Column()
    status:boolean;

    @Column({ type: 'datetime' })
    create_time: Date;

    @Column({ type: 'datetime' })
    update_time: Date;

    @Column({ type: 'datetime' })
    delete_time: Date;

    @OneToMany(
        () => ArticleEntity,
        article => article.community_id,
      )
      article_list: ArticleEntity[];

}