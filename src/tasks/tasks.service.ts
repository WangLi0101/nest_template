import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TasksService {
  @Cron('0 0 0 * * 1')
  clearLog() {
    // 获取logs目录下的内容
    const logs = fs.readdirSync(path.join(__dirname, '../logFile'));
    const fileList = logs.filter(
      (el) => el.includes('error') || el.includes('warn'),
    );
    fileList.forEach((el) => {
      const filePath = path.join(__dirname, `../logFile/${el}`);
      const stats = fs.statSync(filePath);
      const creationDate = stats.birthtime;
      if (creationDate < new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)) {
        fs.unlinkSync(filePath);
      }
    });
  }
}
