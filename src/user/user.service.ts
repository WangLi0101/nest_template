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
import { Like, Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LoginDto, PageDto, UpdatePasswordDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from './bcrypt.service';
import { TokenPayload } from 'types';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { CaptchaService } from './captcha.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Roles } from 'src/roles/entities/roles.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly useRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly captchaService: CaptchaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password, ...profile } = createUserDto;
    const hashPassword = await this.bcryptService.generateHash(password);
    const role = await this.roleRepository.findOneBy({ key: 'SYS_COOMON' });
    if (!role) throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);
    const userTemp = this.useRepository.create({
      username,
      password: hashPassword,
      profile,
      roles: [role],
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
    const { username, password, code, codeId } = loginDto;
    const codeText = await this.cacheManager.get<string>(codeId);

    if (!codeText) {
      throw new HttpException('验证码过期', HttpStatus.BAD_REQUEST);
    }

    if (code.toLocaleLowerCase() !== codeText.toLocaleLowerCase()) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

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

  async getCode() {
    const res = await this.captchaService.createCode();
    return res;
  }
}
