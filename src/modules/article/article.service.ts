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
import { LikesLogEntity } from '../entity/likes_log.entity';
import { FollowLogEntity } from '../entity/follow_log.entity';


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
    @InjectRepository(LikesLogEntity)
    private readonly likeslogRepository: Repository<LikesLogEntity>,
    @InjectRepository(FollowLogEntity)
    private readonly followlogRepository: Repository<FollowLogEntity>,
    private connection: Connection,
    
  ) {}

  //首页列表
  async get_choose_list(pageParam): Promise<any>{
    
    const home_list = await this.articleRepository.find({
      where:{status:true,delete_time:null},
      relations: ['img_list','author_info','community_id'],
      skip:pageParam.limit * (pageParam.page - 1),
      take:pageParam.limit,
      order:{id:'ASC'},
    });
    //设置两个状态（点赞is_like、关注用户is_follow）
    // 直接让前端传用户id
    const res=[]
    home_list.map((item)=>{
      res.push(item)
    })

    for(let i in res){
      const is_like = await this.likeslogRepository.find({where:{article_id:res[i].id,user_id:pageParam.user_id,delete_time:null}})
      console.log("首页列表用户id",res[i].author_info.id)
      is_like.length>0?res[i].is_likes=1:res[i].is_likes=0
      const is_follow = await this.followlogRepository.find({where:{author_id:res[i].author_info.id,user_id:pageParam.user_id,delete_time:null}})
      is_follow.length>0?res[i].is_follow=1:res[i].is_follow=0
    }


    return  {
      status:200,
      description:'数据请求成功',
      body:res
    }
  }

  //最新
  async cieclr_new_list(pageParam): Promise<any>{
    const new_list =await this.articleRepository.find({
      where:{status:true,community_id:pageParam.community_id,delete_time:null},
      relations: ['img_list','author_info'],
      skip:pageParam.limit * (pageParam.page - 1),
      take:pageParam.limit,order:{create_time:'DESC'},
    });
    const res=[]
    new_list.map((item)=>{
      res.push(item)
    })
    for(let i in res){
      const is_like = await this.likeslogRepository.find({where:{article_id:res[i].id,user_id:pageParam.user_id,delete_time:null}})
      console.log("最新",res[i].author_info.id)
      is_like.length>0?res[i].is_likes=1:res[i].is_likes=0
      const is_follow = await this.followlogRepository.find({where:{author_id:res[i].author_info.id,user_id:pageParam.user_id,delete_time:null}})
      is_follow.length>0?res[i].is_follow=1:res[i].is_follow=0
    }
    return  res
  }

  //最热
  async cieclr_hot_list(pageParam): Promise<any>{
    const hot_list =await this.articleRepository.find({
      where:{status:true,community_id:pageParam.community_id,delete_time:null},
      relations: ['img_list','author_info'],
      skip:pageParam.limit * (pageParam.page - 1),
      take:pageParam.limit,order:{likes:'DESC'},
    });
    const res=[]
    hot_list.map((item)=>{
      res.push(item)
    })
    for(let i in res){
      const is_like = await this.likeslogRepository.find({where:{article_id:res[i].id,user_id:pageParam.user_id,delete_time:null}})
      console.log("最热的用户ID",res[i].author_info.id)
      is_like.length>0?res[i].is_likes=1:res[i].is_likes=0
      const is_follow = await this.followlogRepository.find({where:{author_id:res[i].author_info.id,user_id:pageParam.user_id,delete_time:null}})
      is_follow.length>0?res[i].is_follow=1:res[i].is_follow=0
    }


    return  res
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
    console.log("添加评论的所有信息",req)
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

    //更新文章评论数
    const count_comment = await this.commentRepository.find({where:{article_id:req.body.article_id}})
    const article_id = await this.articleRepository.find({where:{id:req.body.article_id}})
    const update_article = new ArticleEntity()
    update_article.comments = count_comment.length
    await this.articleRepository.update(article_id[0].id,update_article)
    
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
    if(req.pid){
      const res=await this.commentRepository.find({
        where:{status:true,article_id:req.article_id,pid:req.pid},
        relations:['user'],
        order:{create_time:'DESC'}
      })
      return res
    }
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
    console.log("fb用户id",user_id)
    const community_id = await this.circleRepository.find({select:['id'],where:{status:true,id:req.body.community_id}})
    console.log("fb圈子id",community_id)
    if(user_id.length<1||community_id.length<1){
      throw new HttpException(
        {
          status:400,
          description:'用户状态异常，请联系管理员,用户或圈子不存在',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //文章入数据库
    const article = new ArticleEntity()
    article.content = req.body.content 
    article.status = true
    article.type = req.body.type==="tw"?1:0
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
        console.log("图片列表",isimg)
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


  //点赞
  async like_article(req):Promise<any>{
    const user_id = await this.userRepository.find({where:{user_name:req.user.username},select:['id']})
    //检查当前状态，不存在添加为点赞，存在则设置成取消
    const status = await this.likeslogRepository.find({article_id:req.body.article_id,delete_time:null,user_id:user_id[0].id})
     
    console.log("点赞当前状态",status)
    if(status.length>0){
      //取消
      const id = await this.likeslogRepository.find({where:{user_id:user_id[0].id,delete_time:null},select:['id']})
      const like = new LikesLogEntity()
      like.update_time = new Date()
      like.delete_time = new Date()
      await this.likeslogRepository.update(id[0].id,like)
      //统计当前文章点赞数
     const count_num = await this.likeslogRepository.find({where:{article_id:req.body.article_id,delete_time:null}})
      const likes = await this.articleRepository.find({where:{id:req.body.article_id}})
      const update_likes = new ArticleEntity()
      update_likes.likes = count_num.length
      await this.articleRepository.update(likes[0].id,update_likes)
    }else{
      //添加
      const like = new LikesLogEntity()
      like.user_id = user_id[0].id
      like.article_id = req.body.article_id
      like.create_time = new Date()
      await this.likeslogRepository.save(like)
      //统计当前文章点赞数
     const count_num = await this.likeslogRepository.find({where:{article_id:req.body.article_id,delete_time:null}})
      const likes = await this.articleRepository.find({where:{id:req.body.article_id}})
      const update_likes = new ArticleEntity()
      update_likes.likes = count_num.length
      await this.articleRepository.update(likes[0].id,update_likes)
    }
    //统计当前文章点赞数
    const count_num = await this.likeslogRepository.find({where:{article_id:req.body.article_id,delete_time:null}})
    
   
    return {
      status:200,
      description:status.length>0?"已取消":"点赞成功",
      body:{start_count:count_num.length,iscancelstar:status.length>0?false:true}
    };
  }



//删除动态
async del_news(req):Promise<any>{
  // const user_id = await this.userRepository.find({where:{user_name:req.user.username},select:['id']})
  //验证当前文章是否存在
  const id = await this.articleRepository.find({where:{id:req.body.article_id},select:['id']})
  // console.log(id[0].author_info.user_name)
  const article = new ArticleEntity()
  article.update_time = new Date()
  article.delete_time = new Date()
  article.status = false
  const res = await this.articleRepository.update(id[0].id,article)
  return {
        status:200,
        description:'删除成功',
        body:res
  }
}

async del_comments(req):Promise<any>{
  //验证当评论id
  const id = await this.commentRepository.find({where:{id:req.body.comment_id},select:['id']})
  const comment = new CommentEntity()
  comment.update_time = new Date()
  comment.delete_time = new Date()
  comment.status = false
  const res = await this.commentRepository.update(id[0].id,comment)
  return {
    status:200,
    description:'删除成功',
    body:res
}

}

//设置最佳答案
async selected(req):Promise<any>{
  const user_id = await this.userRepository.find({select:['id'],where:{status:true,user_name:req.user.username}})
  // const article_id = req.body.article_id
  const comments_id = req.body.comments_id
  const selected = new CommentEntity()
  selected.selected = true
  const res = await this.commentRepository.update(comments_id,selected)
  return res
}

//获取回答列表
async get_comment_selected(req): Promise<any>{
  const res=await this.commentRepository.find({
    where:{status:true,article_id:req.article_id},
    relations:['user'],
    order:{create_time:'DESC'}
  })
  return res
}

}
