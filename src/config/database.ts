import { join } from 'path';
export default {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root123',
  database: 'car_club',
  entities: [join(__dirname, '../', '**/**.entity{.ts,.js}')],
  synchronize: true,  //打开同步锁
};
