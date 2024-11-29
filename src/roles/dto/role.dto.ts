import { IsArray, IsInt } from 'class-validator';

export class AssignRoleDto {
  @IsInt({ message: '用户ID必须是数字' })
  userId: number;
  @IsArray({ message: '角色ID必须是数组' })
  roleIds: number[];
}
