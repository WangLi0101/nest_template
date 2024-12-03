import { PickType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class PageDto {
  @IsInt()
  page: number;

  @IsInt()
  pageSize: number;

  username: string;

  roles: number[];
}

export class LoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class UpdatePasswordDto extends PickType(CreateUserDto, ['password']) {
  @IsInt()
  id: number;
}

export class UpdateMyPasswordDto extends PickType(CreateUserDto, [
  'password',
]) {}
