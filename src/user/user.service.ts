import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly useRepository: Repository<User>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userTemp = this.useRepository.create(createUserDto);
    return this.useRepository.save(userTemp);
  }

  findAll() {
    this.logger.log('findAll');
    return this.useRepository.find();
  }

  findOne(id: number) {
    return this.useRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.useRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.useRepository.delete(id);
  }
}
