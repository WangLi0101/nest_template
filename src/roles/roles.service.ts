import { AssignRoleDto } from 'src/roles/dto/role.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Roles } from './entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
