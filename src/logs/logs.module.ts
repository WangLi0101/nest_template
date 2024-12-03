import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { utilities, WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { Console } from 'winston/lib/winston/transports';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { LogsEnum } from 'types/config.enum';
import { Logs } from './entities/logs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Logs]),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransports = new Console({
          level: configService.get(LogsEnum.LOG_LEVEL),
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike(),
          ),
        });
        const warnFileTransports = new DailyRotateFile({
          level: 'warn',
          dirname: 'logs',
          filename: 'warn-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        });

        const errorFileTransports = new DailyRotateFile({
          level: 'error',
          dirname: 'logs',
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        });
        const logOn = configService.get(LogsEnum.LOG_ON);
        return {
          transports: [
            consoleTransports,
            ...(logOn ? [warnFileTransports, errorFileTransports] : []),
          ],
        };
      },
    }),
  ],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
