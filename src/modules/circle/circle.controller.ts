import { Controller, Get, Post, Patch, Query, Delete, Body, Param, Headers ,Put,UseGuards,Request} from '@nestjs/common';
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


@ApiBearerAuth()
@ApiTags('circle 车友圈')
@Controller('/community')
export class CircleController {
  constructor(private readonly circleService: CircleService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('get_community_choose_list')
  async get_choose_list(@Query() req){
    const res =  this.circleService.get_choose_list(req);  
    return res
  }

}
