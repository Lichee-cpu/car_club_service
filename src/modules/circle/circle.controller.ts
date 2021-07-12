import { Controller, Get, Post, Patch, Query, Delete, Body, Param, Headers ,Put,UseGuards,Request, Render} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CircleService } from './circle.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@ApiBearerAuth()
@ApiTags('circle 车友圈')
@Controller('/community')
export class CircleController {
  constructor(private readonly circleService: CircleService) {}


  @UseGuards(AuthGuard('jwt'))
  @Get('get_community_choose_list')
  async get_choose_list(@Query() req){
    console.log(req)
    const res =  this.circleService.get_choose_list(req);  
    return res
  }

  //未登录==获取热门车友圈
  @Get('get_community_hot')
  async hot_circle0(@Request() req){
    console.log(req.query.isLogin)
    console.log(typeof req.query.isLogin)
    if(req.query.isLogin==='0'){
      const res =  this.circleService.get_hot_circle(req);  
      return res
    }else{
      return "用户已登录，请检查接口"
    }
  }
  //已登录==获取热门车友圈
  @UseGuards(AuthGuard('jwt'))
  @Get('get_community_hot1')
  async hot_circle1(@Request() req){
    const res =  this.circleService.get_hot_circle1(req);  
      return res
  }

  
  //加入圈子
  @UseGuards(AuthGuard('jwt'))
  @Post('circle/add_community')
  async join_circle(@Request() req){
    const res = this.circleService.join_circle(req);
    return res
  }
  
  //退出圈子
  @UseGuards(AuthGuard('jwt'))
  @Put('circle/quit_community')
  async quit_circle(@Request() req){
    const res = this.circleService.quit_circle(req);
    return res
  }

  //单项车友圈信息
  @Get('circle/circle_info')
  async circle_info(@Query() req){
    const res =  this.circleService.circle_info(req);  
    return res
  }

}
