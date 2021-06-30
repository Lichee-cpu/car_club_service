import { Controller, Get, Post, Patch, Query, Delete, Body, 
  HttpException,HttpStatus,ParseIntPipe,
  Param, Headers ,Put,UseFilters} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../../../project-car/src/common/filters/http-exception.filter';


@ApiBearerAuth()
@ApiTags('User')
@UseFilters(new HttpExceptionFilter())
@Controller('/user')
export class UserController {
  constructor(private readonly catsService: UserService) {}

  // 查询
  @Get()
  fetch(@Query() { id }, @Headers('token') token): string {
    if (!id) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, message: '请求参数id 必传', error: 'id is required' },
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log(token);
    return this.catsService.fetch(id);
  }

  // 创建
  @Post()
  save(@Body() { message }): string {
    return this.catsService.save(message);
  }

  // 更新
  @Put(':id')
  update(@Param('id',new ParseIntPipe()) id , @Body() { message }): string {
    return this.catsService.update(id, message);
  }

  // 删除
  @Delete()
  remove(@Query() { id }): string {
    return this.catsService.remove(id);
  }
}
