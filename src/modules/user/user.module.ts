import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from '../entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStrategy } from './local.strategy';
import { FollowLogEntity } from '../entity/follow_log.entity';

@Module({
 
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity,FollowLogEntity]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2 days' },
    }),
],
  controllers: [UserController],
  providers: [UserService,JwtStrategy,LocalStrategy],
  exports: [UserService],
})
export class UserModule {}
