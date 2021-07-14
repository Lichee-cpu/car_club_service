import { Controller, Get, Post, Body, Param,UseGuards,Request, Put} from '@nestjs/common';
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
    // console.log(req)
    const newParam = {user_name:req.user.username,password:req.user.password}
    console.log('登录接口用户名',newParam.user_name)
    const res = await this.userService.login(newParam)
    
    if(res===false){
      const newParam = { user_name:req.user.username,
        user_photo:'http://api.rosysun.cn/sjtx/',
        password:req.user.password, 
        status: true,
        create_time:new Date().toISOString(),
        resume:"暂无简介"};
      const res = await this.userService.reg(newParam);
      if(res){
        const newParam = {user_name:req.user.username,password:req.user.password}
        console.log('注册登录接口用户名',newParam.user_name)
        const res = await this.userService.login(newParam)
        return res
      }
    }else{
      return res;
    }
    
  }


  //获取用户信息
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProfile(@Request() req) {
    const res = this.userService.getprofile(req.user)
    console.log('获取用户信息',req.user)
    return res;
  }

  //退出登录
  @Post('/logout')
  logout(@Request() req){
    return {status:200}
  }

  //我的动态
  @UseGuards(AuthGuard('jwt'))
  @Get('/my_interflow')
  interflow(@Request() req) {
    const res = this.userService.get_interflow(req.user)
    console.log('我的动态',req.user)
    return res;
  }

  //我的评论
  @UseGuards(AuthGuard('jwt'))
  @Get('/my_comments')
  comments(@Request() req) {
    const res = this.userService.get_comments(req.user)
    console.log('我的评论',req.user)
    return res;
  }


  //关注用户
  @UseGuards(AuthGuard('jwt'))
  @Post('/follow_user')
  async follow(@Request() req){
    const res = this.userService.follow(req)
    return {
      status:200,
      description:'关注成功',
      body:res
    };
  }
  //取消关注
  @UseGuards(AuthGuard('jwt'))
  @Post('/cancel_follow_user')
  async cancel_follow(@Request() req){
    const res = this.userService.cancel_follow(req)
    return {
      status:200,
      description:'取消关注成功',
      body:res
    };
  }
  //设置用头像
  @UseGuards(AuthGuard('jwt'))
  @Post('/upload_photo')
  async upload_photo(@Request() req){
    const res = this.userService.upload_photo(req)
  }
  
}
