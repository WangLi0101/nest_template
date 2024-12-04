import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名格式不正确' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码格式不正确' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  password: string;

  @IsNotEmpty({ message: '姓名不能为空' })
  @IsString({ message: '姓名格式不正确' })
  name: string;

  @IsNotEmpty({ message: '性别不能为空' })
  @IsNumber({}, { message: '性别格式不正确' })
  gender: number;

  @IsString({ message: '头像格式不正确' })
  @IsOptional()
  @Transform(({ value }) => value || '') // 默认值为 '默认名称'
  avatar: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;
}
