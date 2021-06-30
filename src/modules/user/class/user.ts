import { ApiProperty } from '@nestjs/swagger';




export class User {
  @ApiProperty({ example: '4515afgdf5daevd4', description: '唯一标识' })
  uuid: number;

  @ApiProperty({ example: 'tset2', description: 'The name of the test2' })
  name: string;

  @ApiProperty({
    example: '/public/a.jpg',
    description: '头像',
  })
  user_photo: string;

}
