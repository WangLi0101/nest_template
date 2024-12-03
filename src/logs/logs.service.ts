import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logs } from './entities/logs.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}
  create(createLogDto: CreateLogDto) {
    return 'This action adds a new log';
  }

  findAll() {
    return `This action returns all logs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} log`;
  }

  update(id: number, updateLogDto: UpdateLogDto) {
    return `This action updates a #${id} log`;
  }

  remove(id: number) {
    return this.logsRepository.delete(id);
  }

  groupByUser(userId: number) {
    return this.logsRepository
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT(logs.result)', 'count')
      .leftJoin('logs.user', 'user')
      .where('user.id = :userId', { userId })
      .groupBy('logs.result')
      .getRawMany();
  }
}
