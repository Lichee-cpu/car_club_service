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

}
