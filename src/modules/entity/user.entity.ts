import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne ,ManyToMany,JoinTable} from 'typeorm';
// import { ArticleEntity } from './article.entity';
import { PhotoEntity } from '../photo/photo.entity';
import { ArticleEntity } from './article.entity';
import { CircleEntity } from './circle.entity';
import {CircleLogEntity} from './circle_log.entity'
import { CommentEntity } from './comment.entity';

//用户表
@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid:string;

  @Column({ length: 20 })
  user_name: string;

  @Column('varchar')
  password: string;

  @Column({ type: 'varchar',length:255})
  user_photo:string;
  
  @Column({ type: 'varchar', length: 80 })
  resume:string;

  @Column()
  status: boolean;

  @Column()
  level: boolean;

  @Column()
  power: boolean;

  @Column({ type: 'datetime' })
  create_time: Date;

  @Column({ type: 'datetime' })
  last_time: Date;

  @Column({ type: 'datetime' })
  delete_time: Date;

  @OneToMany(
    () => PhotoEntity,
    photo => photo.user,
  )
  photos: [];

  @OneToMany(
    () => ArticleEntity,
    article => article.author_info,
  )
  author_info: ArticleEntity[];

  //一个用户可以创多个圈子
  @OneToMany(
    () => CircleEntity,
    circle => circle.circle_master,
  )
  circle_list: CircleEntity[];

  @OneToMany(
    ()=>CommentEntity,
    comment=>comment.user
  )
  comment_list:CommentEntity[]

  //用户与圈子关系
  // @OneToMany(
  //   () => CircleLogEntity,
  //   circlelog=>circlelog.user_id
  // )
  // circles:CircleLogEntity[]

}
