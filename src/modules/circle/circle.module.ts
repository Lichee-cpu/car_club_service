import { Module } from '@nestjs/common';
import { CircleController } from './circle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CircleService } from './circle.service';
import { CircleEntity } from '../entity/circle.entity';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { CircleLogEntity } from '../entity/circle_log.entity';


@Module({
  imports: [PassportModule,Repository,TypeOrmModule.forFeature([CircleEntity,UserEntity,CircleLogEntity])],
  
  controllers: [CircleController],
  providers: [CircleService],
})
export class CircleModule {}
