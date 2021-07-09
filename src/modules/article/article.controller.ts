import { Controller, Get, Post, Patch, Query, Delete, Body, Param, Headers ,Put,UseGuards,Request} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { AuthGuard } from '@nestjs/passport';


@ApiBearerAuth()
@ApiTags('circle 车友圈')
@Controller('/community')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}


  @Get('get_community_home_list')
  async get_choose_list(@Query() req){
    const res =  this.articleService.get_choose_list(req);  
    return res
  }

  //最新
  @Get('circle/circle_article_new')
  async cieclr_new_list(@Query() req){
    const res = this.articleService.cieclr_new_list(req)
    return res
  }

  //最热门
  @Get('circle/circle_article_hot')
  async cieclr_hot_list(@Query() req){
    const res = this.articleService.cieclr_hot_list(req)
    return res
  }

  //获取帖子详情
  @Get('article')
  async article_info(@Query() req){
    const res = this.articleService.article_info(req)
    return res
  }

  //发布评论
  @UseGuards(AuthGuard('jwt'))
  @Post('article/comment')
  async add_comment(@Request() req){
    const res =  this.articleService.add_comment(req);  
    return res
  }

  //获取评论列表
  @Get('article/get_comment')
  async get_comment(@Query() req){
    const res = this.articleService.get_comment(req)
    return res
  }

    //发布图文
    @UseGuards(AuthGuard('jwt'))
    @Post('article/upload_article')
    async add_article(@Request() req){
      const res =  this.articleService.add_article(req);  
      return res
    }
 

}
