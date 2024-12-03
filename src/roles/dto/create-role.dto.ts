import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: '角色名称不能为空' })
  @IsString({ message: '角色名称必须是字符串' })
  name: string;

  @IsNotEmpty({ message: 'key不能为空' })
  @IsString({ message: 'key必须是字符串' })
  key: string;
}
