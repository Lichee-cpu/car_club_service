import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CircleEntity } from '../entity/circle.entity';
import { UserEntity } from '../entity/user.entity';
import { Repository, Connection, getRepository, getConnection } from 'typeorm';
import { UserService } from '../user/user.service';


@Injectable()
export class CircleService {
  
  constructor(
    @InjectRepository(CircleEntity)
    private readonly circleRepository: Repository<CircleEntity>,
    private connection: Connection,
    
  ) {}

  async get_choose_list(pageParam): Promise<any>{
    // const res = await this.circleRepository.find({skip:pageParam.page * (pageParam.current - 1),take:pageParam.page,order:{name:'ASC'}});
    const res = await this.circleRepository.find({
      where:{status:true},
      skip:pageParam.limit * (pageParam.page - 1),
      take:pageParam.limit,order:{id:'ASC'},
      select:['id','name','all_num','community_content_num','img_path','create_time']
      
    });
    return  {
      status:200,
      description:'数据请求成功',
      body:res
    }
  }
 

  
}
