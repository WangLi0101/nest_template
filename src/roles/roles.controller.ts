import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignMenuDto, AssignRoleDto } from './dto/role.dto';
import { JwtPayload } from 'src/common/decorator/jwtPayload.decorator';
import { TokenPayload } from 'types';
@Controller('role')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  @Post('/assignRole')
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.rolesService.assignRole(assignRoleDto);
  }

  @Post('/assignMenu')
  assignMenu(@Body() assignMenuDto: AssignMenuDto) {
    return this.rolesService.assignMenu(assignMenuDto);
  }

  @Get('/menu/:roleId')
  getMenu(@Param('roleId') roleId: number) {
    return this.rolesService.getMenu(+roleId);
  }

  @Get('/my/menu')
  getMyMenu(@JwtPayload() payload: TokenPayload) {
    return this.rolesService.getMyMenu(payload);
  }
}
