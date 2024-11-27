import { Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEnum } from 'types/config.enum';
import { User } from 'src/database/user.entity';
import { Profile } from 'src/database/profile.entity';
import { Roles } from 'src/database/roles.entity';
import { Logs } from 'src/database/logs.entity';
import { LogsModule } from './logs/logs.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get(ConfigEnum.DATA_HOST),
        port: configService.get(ConfigEnum.DATA_PORT),
        username: configService.get(ConfigEnum.DATA_USERNAME),
        password: configService.get(ConfigEnum.DATA_PASSWORD),
        database: configService.get(ConfigEnum.DATA_BASE),
        entities: [User, Profile, Roles, Logs],
        synchronize: true,
        logging: ['error'],
      }),
    }),

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
