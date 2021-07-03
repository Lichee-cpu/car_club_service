import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne,ManyToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';


//图片表
@Entity({ name: 'img' })
export class ImgEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => ArticleEntity,
        article => article.img_list,
      )
    article: ArticleEntity;

    @Column()
    img_name: string;

    @Column()
    img_path: string;
    
    @Column('varchar')
    img_type: string;
    
    @Column({ type: 'datetime' })
    create_time: Date;

    @Column({ type: 'datetime' })
    update_time: Date;

    @Column({ type: 'datetime' })
    delete_time: Date;
}