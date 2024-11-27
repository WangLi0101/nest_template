import { Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from './logs/logs.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { connectionParams } from 'ormconfig';
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
console.log('currentEnv', envFilePath, process.env.NODE_ENV);

@Module({
  imports: [
    // 环境变量
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
    }),

    // 数据库
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    LogsModule,
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [Logger],
})
export class AppModule {}
