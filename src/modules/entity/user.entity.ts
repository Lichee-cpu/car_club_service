import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
// import { ArticleEntity } from './article.entity';
import { PhotoEntity } from '../photo/photo.entity';
import { ArticleEntity } from './article.entity';

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

  @Column({ type: 'varchar', length: 80 })
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


}
