import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entity/article.entity';
import { UserEntity } from '../entity/user.entity';
import { Repository, Connection, getRepository, getConnection } from 'typeorm';
import { UserService } from '../user/user.service';
import { CommentEntity } from '../entity/comment.entity';
import { threadId } from 'worker_threads';



@Injectable()
export class ArticleService {
  
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  //最新
  async cieclr_new_list(pageParam): Promise<any>{
    const res = this.articleRepository.find({
      where:{status:true,community_id:pageParam.community_id},
      relations: ['img_list','author_info'],
      skip:pageParam.limit * (pageParam.page - 1),
      take:pageParam.limit,order:{create_time:'DESC'},
    })
    return res
  }

  //最热
  async cieclr_hot_list(pageParam): Promise<any>{
    const res = this.articleRepository.find({
      where:{status:true,community_id:pageParam.community_id},
      relations: ['img_list','author_info'],
      skip:pageParam.limit * (pageParam.page - 1),
      take:pageParam.limit,order:{views:'DESC'},
    })
    return res
  }

  //帖子详情
  async article_info(req): Promise<any>{
    const res = this.articleRepository.find({
      where:{status:true,delete_time:null,id:req.article_id},
      relations:['img_list','author_info']
    })
    return res
  }

  //添加评论
  async add_comment(req): Promise<any>{
    const user_id = await this.userRepository.find({select:['id'],where:{status:true,user_name:req.user.username}})
    const comment = new CommentEntity()
    comment.article_id = req.body.article_id 
    comment.pid = req.body.pid
    comment.content = req.body.content
    comment.status = true
    comment.user = user_id[0].id
    comment.create_time = new Date()
    
    const res= await this.commentRepository.save(comment)
    if(res){
      return {
        status:200,
        description:'数据请求成功',
        body:res
      }
    }
    throw new HttpException(
      {
        status:400,
        description:'查询对象状态异常，请联系管理员',
      },
      HttpStatus.BAD_REQUEST,
    );
    
  }
 
  //获取评论列表
  async get_comment(req): Promise<any>{
    const res=await this.commentRepository.find({
      where:{status:true,article_id:req.article_id},
      relations:['user'],
      order:{create_time:'DESC'}
    })
    return res
  }



  
}
