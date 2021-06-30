import { Controller, Get, Post, Patch, Query, Delete, Body, Param, Headers ,Put} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CatsService } from './cats.service';
import { Cats, UserRole } from './class/cats';

@ApiBearerAuth()
@ApiTags('cats 标题')
@Controller('/cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  // 查询
  @Get()
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'role', enum: UserRole })
  @ApiResponse({
    status: 200,
    description: 'get ...',
    type: Cats,
  })
  fetch(@Query() { id }, @Headers('token') token): string {
    console.log(token);
    return this.catsService.fetch(id);
  }

  // 创建
  @Post()
  @ApiBody({ description: '填写更新内容' })
  save(@Body() { message }): string {
    return this.catsService.save(message);
  }

  // 更新
  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiBody({ description: '请输入message' })
  update(@Param() { id }, @Body() { message }): string {
    return this.catsService.update(id, message);
  }

  // 删除
  @Delete()
  remove(@Query() { id }): string {
    return this.catsService.remove(id);
  }
}
