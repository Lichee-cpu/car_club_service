import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne,ManyToOne, ManyToMany } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from './user.entity';
import {CircleLogEntity} from './circle_log.entity'

//圈子表
@Entity({ name: 'circle' })
export class CircleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    //圈子名称
    @Column('varchar')
    name: string;

    //主图
    @Column('varchar')
    img_path: string;

    //圈子介绍
    @Column('varchar')
    circle_resume: string;

    //活跃用户头像
    @Column({ type: 'longtext' })
    active_user_photo: string;

    //三张信息图片
    @Column({ type: 'longtext' })
    hot_circle_img: string;

    //活跃用户数
    @Column()
    active_num:number;

    //总数
    @Column()
    all_num:number;

    //圈子文章数
    @Column()
    community_content_num:number;

    //圈子状态
    @Column()
    status:boolean;

    //用户显示是否加入
    @Column()
    is_join:number

    //多对一，一个圈子只属于一个用户创建
    @ManyToOne(
      () => UserEntity,
      user => user.circle_list,
    )
    circle_master:UserEntity



    //圈子创建时间
    @Column({ type: 'datetime' })
    create_time: Date;

    @Column({ type: 'datetime' })
    update_time: Date;

    @Column({ type: 'datetime' })
    delete_time: Date;

    //一对多，一个圈子可以有多篇帖子
    @OneToMany(
        () => ArticleEntity,
        article => article.community_id,
      )
      article_list: ArticleEntity[];

      
    // @OneToMany(
    //   () => CircleLogEntity,
    //   circlelog=>circlelog.community_id
    // )
    // users:CircleLogEntity[]

}