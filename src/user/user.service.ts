import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'database/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly useRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userTemp = this.useRepository.create(createUserDto);
    return this.useRepository.save(userTemp);
  }

  findAll() {
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
