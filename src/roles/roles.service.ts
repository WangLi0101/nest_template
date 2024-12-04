import { AssignMenuDto, AssignRoleDto } from 'src/roles/dto/role.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Roles } from './entities/roles.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { TokenPayload } from 'types';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}
  create(createRoleDto: CreateRoleDto) {
    return this.rolesRepository.save(createRoleDto);
  }

  findAll() {
    return this.rolesRepository.find();
  }

  findOne(id: number) {
    return this.rolesRepository.findOneBy({ id });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.rolesRepository.update(id, updateRoleDto);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (!role) throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);
    return this.rolesRepository.remove(role);
  }

  async assignRole(data: AssignRoleDto) {
    const { userId, roleIds } = data;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    const roles = await this.rolesRepository.findBy({ id: In(roleIds) });
    user.roles = roles;
    return this.userRepository.save(user);
  }

  async assignMenu(data: AssignMenuDto) {
    const { roleId, menuIds } = data;
    const role = await this.findOne(roleId);
    if (!role) throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);
    const menus = await this.menuRepository.findBy({ id: In(menuIds) });
    role.menus = menus;
    return this.rolesRepository.save(role);
  }

  async getMenu(roleId: number) {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: {
        menus: {
          parent: true,
        },
      },
    });
    if (!role) throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);
    return role.menus.map((menu) => {
      return {
        ...menu,
        parentId: menu.parent ? menu.parent.id : null,
      };
    });
  }

  async getMyMenu(payload: TokenPayload) {
    const { roles } = payload;
    const rolesRes = await this.rolesRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.menus', 'menu')
      .leftJoinAndSelect('menu.parent', 'parent')
      .where('role.key IN (:...roles)', { roles })
      .orderBy('menu.sort', 'ASC')
      .getMany();
    const map = new Map();
    rolesRes.forEach((el) => {
      el.menus.forEach((menu) => {
        const { parent, ...list } = menu;
        map.set(menu.id, { ...list, parentId: parent?.id });
      });
    });
    return Array.from(map.values());
  }
}
