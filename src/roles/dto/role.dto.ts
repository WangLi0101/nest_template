import { IsArray, IsInt } from 'class-validator';

export class AssignRoleDto {
  @IsInt({ message: '用户ID必须是数字' })
  userId: number;
  @IsArray({ message: '角色ID必须是数组' })
  roleIds: number[];
}

export class AssignMenuDto {
  @IsInt({ message: '角色ID必须是数字' })
  roleId: number;
  @IsArray({ message: '菜单ID必须是数组' })
  menuIds: number[];
}
