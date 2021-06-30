import { IsInt, IsString } from 'class-validator';

export class CreateCatDto {
  @IsString()
  readonly name: string;

  @IsInt()
  readonly uuid: number;

  @IsString()
  readonly user_photo: string;
}
