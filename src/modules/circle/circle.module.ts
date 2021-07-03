import { Module } from '@nestjs/common';
import { CircleController } from './circle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CircleService } from './circle.service';
import { CircleEntity } from '../entity/circle.entity';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from '../entity/user.entity';

@Module({
  imports: [PassportModule,TypeOrmModule.forFeature([UserEntity,CircleEntity])],
  
  controllers: [CircleController],
  providers: [CircleService],
})
export class CircleModule {}
