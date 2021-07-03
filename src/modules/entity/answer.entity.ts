import { Column, Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { QuestionEntity } from './question.entity';


//问题回答表
@Entity({ name: 'answer' })
export class AnswerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(
        () => UserEntity,
        user => user.id,
    )
    user_id:number

    @OneToOne(
        () => QuestionEntity,
        question => question.id,
    )
    question_id:number

    @Column({ type: 'longtext' })
    content:string;
    
    @Column()
    status:boolean;

    @Column({ type: 'datetime' })
    create_time: Date;

    @Column({ type: 'datetime' })
    update_time: Date;

    @Column({ type: 'datetime' })
    delete_time: Date;


}