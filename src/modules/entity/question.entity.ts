import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { CircleEntity } from './circle.entity';


//问题列表
@Entity({ name: 'question' })
export class QuestionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(
        () => UserEntity,
        user => user.id,
    )
    author_id:number

    @OneToOne(
        () => CircleEntity,
        circle => circle.id,
    )
    community_id:number

    @Column({ type: 'longtext' })
    content:string;
    
    @Column({ type: 'longtext' })
    img_list:string;

    @Column()
    reply_num:number;

    @Column()
    status:boolean;

    @Column({ type: 'datetime' })
    create_time: Date;

    @Column({ type: 'datetime' })
    update_time: Date;

    @Column({ type: 'datetime' })
    delete_time: Date;


}