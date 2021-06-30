// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class UserService {
//   fetch(id): string {
//     return `Hello World! ${id}`;
//   }
  

//   save(message): string {
//     return `Set Hello Done.${message}`;
//   }

//   update(id: string, message: string): string {
//     return `Update Hello Done. ${id}：${message}`;
//   }

//   remove(id: number): string {
//     return `${id} Record Was Removed.`;
//   }
// }


import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, Connection, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private connection: Connection,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    // relations: ['photos']， 联合查询
    return await this.userRepository.find({ relations: ['photos'] });
    
    // 或者使用queryBuilder
    // return await getRepository(UsersEntity)
    //   .createQueryBuilder("user")
    //   .leftJoinAndSelect("user.photos", "photo")
    //   .getMany()
  }

  async create(user): Promise<UserEntity[]> {
    const { name } = user;
    const u = await getRepository(UserEntity).findOne({ where: { name } });
    //   .createQueryBuilder('users')
    //   .where('users.name = :name', { name });
    // const u = await qb.getOne();
    if (u) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          error: 'name must be unique.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.userRepository.save(user);
  }

  async createMany(users: UserEntity[]) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      users.forEach(async user => {
        await queryRunner.manager.getRepository(UserEntity).save(user);
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
