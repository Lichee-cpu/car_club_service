import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleEntity } from '../entity/article.entity';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from '../entity/user.entity';
import { CommentEntity } from '../entity/comment.entity';
import { CircleEntity } from '../entity/circle.entity';
import { ImgEntity } from '../entity/img.entity';
@Module({
  imports: [PassportModule,TypeOrmModule.forFeature([UserEntity,ArticleEntity,CommentEntity,CircleEntity,ImgEntity])],
  
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
