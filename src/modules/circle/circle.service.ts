import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CircleEntity } from '../entity/circle.entity';
import { UserEntity } from '../entity/user.entity';
import { Repository, Connection, getRepository, getConnection ,ConnectionOptions} from 'typeorm';
import { UserService } from '../user/user.service';
import { CircleLogEntity } from '../entity/circle_log.entity';
import { async } from 'rxjs';

@Injectable()
export class CircleService {
  
  constructor(
    @InjectRepository(CircleEntity)
    private readonly circleRepository: Repository<CircleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CircleLogEntity)
    private readonly circleLogRepository: Repository<CircleLogEntity>,
  ) {}

  async asd(index,item) {
    var list =[]
    list[index]=item
    console.log('listssss',index,list)
  }

  //获得发布时车友圈选择列表
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

  //获取热门车友圈，用户未登录
  async get_hot_circle(pageParam): Promise<any>{
    const res=await this.circleRepository.find({
      where:{status:true},
      skip:3 * (pageParam.query.page - 1),
      take:3,
      order:{active_num:'DESC'},
      select:['id','name','active_user_photo','hot_circle_img','active_num','create_time','is_join']
    })
    return {
      status:200,
      description:'数据请求成功',
      body:res,

    }
  }

  //获取热门车友圈用户已登录情况
  async get_hot_circle1(req): Promise<any>{
    const user_id =  await this.userRepository.find({where:{status:true,user_name:req.user.username}})
    const circle_res=await this.circleRepository.find({
      where:{status:true},
      skip:3 * (req.query.page - 1),
      take:3,
      order:{active_num:'DESC'},
      select:['id','name','active_user_photo','hot_circle_img','active_num','create_time']
    })
    

    //加工res
    //遍历res
    const arr = []
    circle_res.map((item)=>{
      arr.push(item)
    })

    for(let i in arr){
      // console.log(arr[i].id)
      const res = await this.circleLogRepository.find({where:{community_id:arr[i].id,user_id:user_id[0].id,delete_time:null}})
      res.length>0?arr[i].is_join=1:arr[i].is_join=0
      // console.log(arr[i])
    }

    return  {
      status:200,
      description:'数据请求成功',
      body:arr,

    }
  }

  //加入圈子
  async join_circle(req): Promise<any>{
    //用户id
    const user_id = await this.userRepository.find({select:['id'],where:{status:true,user_name:req.user.username}})
    //圈子id
    const circle_id = req.body.community_id
    //加入前检查是否有记录
    const check = await this.circleLogRepository.find({user_id:user_id[0].id,community_id:circle_id,delete_time:null})

    if(check.length<1){
      if(user_id&&circle_id){
        const circle_log = new CircleLogEntity()
        circle_log.user_id = user_id[0].id
        circle_log.community_id = circle_id
        circle_log.create_time = new Date()
        await this.circleLogRepository.save(circle_log)
        return  {
          status:200,
          description:'数据请求成功',
          body:circle_log
        }
      }else{
        throw new HttpException(
          {
            status:400,
            description:'缺少参数，请检查',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }else{
      throw new HttpException(
        {
          status:400,
          description:'已加入改圈，不必重复加入',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    
  }

  //退出圈子,在连接表查询，查询到就更该
  async quit_circle(req): Promise<any>{
    const user_id = await this.userRepository.find({select:['id'],where:{status:true,user_name:req.user.username}})
    const circle_id = req.body.community_id
    // {where:{user_id:user_id[0].id,community_id:circle_id}}

      // const w = await this.circleLogRepository.find({where:{user_id:user_id[0].id,community_id:circle_id}})
    const res = await this.circleLogRepository.update({user_id:user_id[0].id,community_id:circle_id,delete_time:null},{delete_time:new Date})
    if (res.raw.changedRows){
      return {
        status:200,
        description:'退圈成功',
      }
    }else{
      throw new HttpException(
        {
          status:400,
          description:'退圈失败，请检查',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //获取单项车友圈信息
  async circle_info(req):Promise<any>{
    const res = await this.circleRepository.find({
      select:['id','name','active_user_photo','all_num','circle_resume','img_path'],
      relations: ['circle_master'],
      where:{id:req.community_id,status:true}
    })
    
    if(res.length!==0){
      return {
        status:200,
        description:'数据请求成功',
        body:res
      }
    }else{
      throw new HttpException(
        {
          status:400,
          description:'查询对象状态异常，请联系管理员',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    
  }
 

  
}
