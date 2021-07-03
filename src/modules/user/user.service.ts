import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, Connection, getRepository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import console from 'console';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  

}
