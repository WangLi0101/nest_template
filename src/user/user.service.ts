import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { Like, Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoginDto, PageDto, UpdatePasswordDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from './bcrypt.service';
import { Profile } from 'src/database/profile.entity';
import { TokenPayload } from 'types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly useRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password, ...profile } = createUserDto;
    const hashPassword = await this.bcryptService.generateHash(password);
    const userTemp = this.useRepository.create({
      username,
      password: hashPassword,
      profile,
    });
    return this.useRepository.save(userTemp);
  }

  async findAll(pageDto: PageDto) {
    const [list, total] = await this.useRepository.findAndCount({
      relations: {
        profile: true,
        roles: true,
      },
      skip: (pageDto.page - 1) * pageDto.pageSize,
      take: pageDto.pageSize,
      where: {
        username: Like(`%${pageDto.username}%`),
      },
    });
    return {
      list,
      total,
    };
  }

  findOne(id: number) {
    return this.useRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.useRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
    if (!user) throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    return this.profileRepository.update(user.profile.id, updateUserDto);
  }

  async updatePassword(update: UpdatePasswordDto) {
    const { id, password } = update;
    const user = await this.useRepository.findOneBy({ id });
    if (!user) throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    const hashPassword = await this.bcryptService.generateHash(password);
    return this.useRepository.update(id, { password: hashPassword });
  }

  async remove(id: number) {
    const user = await this.useRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    return this.useRepository.remove(user);
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.useRepository.findOne({
      where: { username },
      relations: {
        roles: true,
      },
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const isMatch = await this.bcryptService.compareHash(
      password,
      user.password,
    );
    if (!isMatch) throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);

    return this.jwtService.sign({
      id: user.id,
      roles: user.roles.map((el) => el.key),
    });
  }

  async getMyInfo(payload: TokenPayload) {
    return this.useRepository.findOne({
      where: { id: payload.id },
      relations: {
        profile: true,
        roles: true,
      },
    });
  }
}
