import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entity/article.entity';
import { UserEntity } from '../entity/user.entity';
import { Repository, Connection, getRepository, getConnection } from 'typeorm';
import { UserService } from '../user/user.service';
import { CommentEntity } from '../entity/comment.entity';
import { threadId } from 'worker_threads';
import { CircleEntity } from '../entity/circle.entity';
import { ImgEntity } from '../entity/img.entity';



@Injectable()
export class ArticleService {
  
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CircleEntity)
    private readonly circleRepository: Repository<CircleEntity>,
    @InjectRepository(ImgEntity)
    private readonly imgRepository: Repository<ImgEntity>,
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
      relations:['img_list','author_info'],
    })
    // const res = await getRepository(ArticleEntity)
    // .createQueryBuilder("article")
    // .where("article.status = :status", { status: true })
    // .andWhere("article.delete_time = :delete_time", { delete_time: null })
    // .andWhere("article.id = :id", { id: req.article_id })
    // .getOne();

    return res
  }

  //添加评论
  async add_comment(req): Promise<any>{
    console.log(req)
    const user_id = await this.userRepository.find({select:['id'],where:{status:true,user_name:req.user.username}})
    if(user_id.length<1){
      throw new HttpException(
        {
          status:400,
          description:'用户状态异常，请联系管理员',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
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


  //发布图文 (还未开启事务)
  async add_article(req): Promise<any>{
    const user_id = await this.userRepository.find({select:['id'],where:{status:true,user_name:req.user.username}})
    const community_id = await this.circleRepository.find({select:['id'],where:{status:true,id:req.body.community_id}})
    if(user_id.length<1||community_id.length<1){
      throw new HttpException(
        {
          status:400,
          description:'用户状态异常，请联系管理员',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //文章入数据库
    const article = new ArticleEntity()
    article.content = req.body.content 
    article.status = true
    article.community_id = req.body.community_id
    article.author_info = user_id[0].id
    article.create_time = new Date()
    const res= await this.articleRepository.save(article)
    if(req.body.img_list.length>=1){
        //解析图片列表
      const imglist = req.body.img_list.split(",")
      for(let i=0 ; i<imglist.length; i++){
        //查询数据库是否有图片
        const isimg = await this.imgRepository.find({where:{img_path:imglist[i]}})
        console.log(isimg)
      if(isimg.length<1){
          console.log("不存在")
          const img = new ImgEntity()
          img.img_path = imglist[i]
          img.create_time = new Date()
          img.article = res.id
          await this.imgRepository.save(img)
        }else{
          console.log("需要更新")
          const img = new ImgEntity()
          img.delete_time = null
          img.update_time = new Date()
          img.article = res.id
          await this.imgRepository.update(isimg[0].id,img) 
        }
      }

     }
   
    if(res){
      return {
        status:200,
        description:'数据请求成功',
        body:res
      }
    }

    return req
  }

  



}
