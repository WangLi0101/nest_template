import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名格式不正确' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码格式不正确' })
  password: string;

  @IsNotEmpty({ message: '性别不能为空' })
  @IsNumber({}, { message: '性别格式不正确' })
  gender: number;

  @IsString({ message: '头像格式不正确' })
  photo: string;

  @IsNotEmpty({ message: '地址不能为空' })
  @IsString({ message: '地址格式不正确' })
  address: string;
}
