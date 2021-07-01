import { Controller, Get, Post, Body, Param,UseGuards,Request} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  
  // 注册接口
  @Post('reg')
  async reg(@Body() param){
    const newParam = { user_name:param.username,password:param.password, status: true,create_time:new Date().toISOString(),resume:"暂无简介"};
    const res = await this.userService.reg(newParam);
    return res;
  }
  //登录接口
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    console.log(req)
    const newParam = {user_name:req.user.username,password:req.user.password}
    console.log('登录接口用户名',newParam.user_name)
    const res = this.userService.login(newParam)
    return res;
  }
  //获取用户信息
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProfile(@Request() req) {
    const res = this.userService.getprofile(req.user)
    return res;
  }

  

  
}
