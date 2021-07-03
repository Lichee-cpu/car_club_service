import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entity/article.entity';
import { UserEntity } from '../entity/user.entity';
import { Repository, Connection, getRepository, getConnection } from 'typeorm';
import { UserService } from '../user/user.service';


@Injectable()
export class ArticleService {
  
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private connection: Connection,
    
  ) {}

  async get_choose_list(pageParam): Promise<any>{
    // const res = await this.circleRepository.find({skip:pageParam.page * (pageParam.current - 1),take:pageParam.page,order:{name:'ASC'}});
    const res = await this.articleRepository.find({
      where:{status:true},
      relations: ['img_list','author_info','community_id'],
      skip:pageParam.limit * (pageParam.page - 1),
      take:pageParam.limit,order:{id:'ASC'},
    });
    // res.forEach(element => {
    // //  const  {id} = element
    // });
    return  {
      status:200,
      description:'数据请求成功',
      body:res
    }
  }
 
}
