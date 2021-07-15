import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, Connection, getRepository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import console from 'console';
import { userInfo } from 'os';
import { FollowLogEntity } from '../entity/follow_log.entity';
import { CommentEntity } from '../entity/comment.entity';

import { ArticleEntity } from '../entity/article.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowLogEntity)
    private readonly followLogRepository: Repository<FollowLogEntity>,

    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,

    private readonly jwtService: JwtService,
    private connection: Connection,
  ) {}

  //注册模块
  async reg(user):Promise<UserEntity[]>{
    const {user_name,password} = user;
    
    if(user_name&&password){
      // console.log('name',user)
      //在数据库中查找name
      const u = await getRepository(UserEntity).findOne({ where: { user_name } });
      if (u) {
        throw new HttpException(
          {
            message: "用户存在了",
            error: 'name must be unique.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      //需要返回token
      return await this.userRepository.save(user);
      }
      
      throw new HttpException(
        {
          message: '缺少参数',
          error: user,
        },
        HttpStatus.BAD_REQUEST,
      );

  }

  //登录模块
  async login(user:any): Promise<any> {
    // const payload = {username: user.user_name, sub: user.userId};
    const v = await this.userRepository.find({where:{user_name:user.user_name}});
    const u = await this.userRepository.find({where:{user_name:user.user_name,password:user.password}});

    if(v.length!=0){
      if(u.length!=0){
        // const uuid = await getRepository(UserEntity).find({ select: ["uuid"],where:{user_name:user.user_name,password:user.password} });
        // console.log(uuid[0])
        // console.log(typeof uuid[0])
        // console.log(typeof uuid[0].uuid)
        const payload = {user_name: user.user_name, password: user.password};
        return {
          status:200,
          description:'登陆成功',
          body:{
            token: this.jwtService.sign(payload),
          }
        };
      }
      return {
        status:400,
        description:'登陆失败，请检查账户或密码'
      }
      
    }
    
    return false
    
  }


  //设置登录信息的
  async validateUser(username: string, pass: string): Promise<any> {
    // const user = await this.userService.find(username);
    const user = { user_name: 'walker123', password: '123321' };
    if (user && user.password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  //获取用户信息
  async getprofile(user):Promise<any>{
    if(user.username){
      const res = await this.userRepository.find({select: ["id","user_name","user_photo","resume","create_time"],where:{user_name:user.username}});
      // const res = await this.userRepository.find({where:{user_name:user.username}});
      const body= {id:res[0].id,nickname:res[0].user_name,avatar:res[0].user_photo,resume:res[0].resume,create_time:res[0].create_time}
      return {
        status:200,
        description:'请求用户数据成功',
        body:body
      }
      // return res0
    }
  }

  //获取我的动态,从图文表中获取数据
  async get_interflow(user):Promise<any>{
    if(user.username){
      //先获取所有
      const res= await this.userRepository.find({where:{user_name:user.username},select:['user_name','user_photo'],relations:['article_list']})
      // 验证是否删除
      // console.log(res)
      const arr = []
      res[0].article_list.map((item,index)=>{
       item.status?arr.push(item):null
      })
      // return arr
      return {
        status:200,
        description:'请求用户数据成功',
        body:[{article_list:arr,user_name:res[0].user_name,user_photo:res[0].user_photo}]
      }
    }
  }

  // //我的评论，先去评论表找当前用户user_id对应的article_id
  // //然后获取article_id的内容，以及作者id
  // async get_comments (user):Promise<any>{
  //   const user_id = await this.userRepository.find({where:{user_name:user.username},select:['id']})
  //   if(user.username){
  //     const article_id = await this.commentRepository.find({where:{user:user_id[0].id}})
  //     // return article_id
  //     //是一个列表，先将列表添加到一个数组，然后再去获取每条
  //     const res=[]
  //     article_id.map((item)=>{
  //     res.push(item)
  //     })
  //     for(let i in res){
  //       const atrticle_content = await this.articleRepository.find({where:{id:res[i].article_id},select:['content','author_info'],relations:['author_info']})
  //       // const author_info = await this.articleRepository.find({where:{id:res[i].article_id},select:['content']})
  //       res[i].atrticle_content = atrticle_content
  //     }
  //     return res


  //   }
  // }

  // 我的评论
  async get_comments (user):Promise<any>{
    // 先找评论表，作者是自己的
    const user_id = await this.userRepository.find({where:{user_name:user.username},select:['id']})
    // const res = await this.commentRepository.find({where:{user:user_id[0].id}})
    //获取用户文章的评论ID
    const res= await this.userRepository.find({where:{user_name:user.username},select:['user_name','user_photo'],relations:['article_list']})
    const arr = []
      res[0].article_list.map((item,index)=>{
       item.status?arr.push(item):null
      })
      //查找属于当前文章id的评论
      const all_lits = []
      for(let i in arr){
        const a = await this.commentRepository.find({where:{article_id:arr[i].id,status:true},relations:['user'],order:{create_time:'ASC'}})
        for(let i in a){
          all_lits.push(a[i])
        }
      }
      const compare = function (prop) {
        return function (obj1, obj2) {
          const val1 = obj1[prop];
          const val2 = obj2[prop];if (val1 > val2) {
                return -1;
            } else if (val1 < val2) {
                return 1;
            } else {
                return 0;
            }            
        } 
    }

      return {
        status:200,
        description:'请求用户数据成功',
        body:all_lits.sort(compare('create_time'))
      }


    // return arr
  }

  //关注用户
  async follow(req):Promise<any>{
    const user_id = await this.userRepository.find({where:{user_name:req.user.username},select:['id']})
    const follow = new FollowLogEntity()
    follow.user_id = user_id[0].id
    follow.author_id = req.body.author_id
    follow.create_time = new Date()
    const res = await this.followLogRepository.save(follow)
    return res
  }
  //取消关注
  async cancel_follow(req):Promise<any>{
    const user_id = await this.userRepository.find({where:{user_name:req.user.username},select:['id']})
    const id = await this.followLogRepository.find({where:{user_id:user_id[0].id},select:['id']})
    const follow = new FollowLogEntity()
    follow.update_time = new Date()
    follow.delete_time = new Date()
    const res = await this.followLogRepository.update(id[0].id,follow)
    return res
  }

  //上传头像
  async upload_photo(req):Promise<any>{
    const user_id = await this.userRepository.find({where:{user_name:req.user.username},select:['id']})
    const photo = new UserEntity()
    photo.user_photo = req.body.photo
    const res = await this.userRepository.update(user_id[0].id,photo)
    return "头像更新成功"
  }

}
