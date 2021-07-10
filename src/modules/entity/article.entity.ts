import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne, ManyToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import {CircleEntity } from './circle.entity'
import { ImgEntity } from './img.entity';
import { type } from 'os';

//文章信息表
@Entity({ name: 'article' })
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    //多对一：文章==》发布者
    @ManyToOne(
        () => UserEntity,
        user => user.article_list,
      )
      author_info: number;

    //多对一：文章==》圈子
    @ManyToOne(
        () => CircleEntity,
        circle => circle.article_list,
    )
    community_id:CircleEntity

    @Column({ type: 'longtext' })
    content:string;
    
    @Column({type:'longtext'})
    img:string;

    @OneToMany(
        () => ImgEntity,
        img => img.article,
      )
    img_list: ImgEntity[];
    // @Column({ type: 'longtext' })
    // img_list:string;
    @Column()
    likes:number;

    @Column()
    views:number;

    @Column()
    comments:number;
    
    @Column()
    status:boolean;

    @Column({ type: 'datetime' })
    create_time: Date;

    @Column({ type: 'datetime' })
    update_time: Date;

    @Column({ type: 'datetime' })
    delete_time: Date;


    
}