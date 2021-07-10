import { resolve } from 'path';
import { Module, MiddlewareConsumer, RequestMethod  } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from './modules/cats/cats.module';
import { photoModule } from './modules/photo/photo.module';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { UserModule } from './modules/user/user.module';
import { CircleModule } from './modules/circle/circle.module';
import { ArticleModule} from './modules/article/article.module';
import statusMonitorConfig from './config/statusMonitor';
import { StatusMonitorModule } from 'nest-status-monitor';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: '127.0.0.1',
    //   port: 3306,
    //   username: 'root',
    //   password: 'root123',
    //   database: 'test',
    //   entities: [join(__dirname, '../', '**/**.entity{.ts,.js}')],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    
    StatusMonitorModule.setUp(statusMonitorConfig),
    
    CatsModule,
    UserModule,
    CircleModule,
    ArticleModule,
    photoModule,
   ],
  
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 为 hello 路由添加中间件
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'cats', method: RequestMethod.POST })  //过滤掉cats路劲的post
      .forRoutes('cats'); //设置根节点
  } 
}
