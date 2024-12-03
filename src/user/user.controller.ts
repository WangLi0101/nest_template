import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  LoginDto,
  PageDto,
  UpdateMyPasswordDto,
  UpdatePasswordDto,
} from './dto/user.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { JwtPayload } from 'src/common/decorator/jwtPayload.decorator';
import { TokenPayload } from 'types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/page')
  findAll(@Body() pageDto: PageDto) {
    return this.userService.findAll(pageDto);
  }

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);

    return this.userService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Public()
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post('/updatePassword')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(updatePasswordDto);
  }

  @Post('/update/my/password')
  updateMyPassword(
    @Body() updatePasswordDto: UpdateMyPasswordDto,
    @JwtPayload() payload: TokenPayload,
  ) {
    return this.userService.updatePassword({
      id: payload.id,
      ...updatePasswordDto,
    });
  }

  @Get('/my/info')
  getMyInfo(@JwtPayload() payload: TokenPayload) {
    return this.userService.getMyInfo(payload);
  }
}
