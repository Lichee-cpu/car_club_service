import { Module } from '@nestjs/common';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { OssService } from '../../common/oss/oss.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from 'nestjs-config';
import { ImgEntity } from '../entity/img.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) => config.get('file'),
      inject: [ConfigService],
    }),TypeOrmModule.forFeature([ImgEntity])],
  controllers: [PhotoController],
  providers: [PhotoService,OssService],
})
export class photoModule {}
