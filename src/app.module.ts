import { Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from './logs/logs.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { connectionParams } from 'ormconfig';
import { TypeORMErrorFilter } from './filters/database-exception.filter';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './roles/roles.module';
import jwtConstants from './utils/jwtConstants';
import { AuthGuard } from './guard/auth.guard';
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
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
    LogsModule,
    RolesModule,
  ],
  controllers: [],
  providers: [
    Logger,
    // 捕获http错误
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // 捕获数据库错误
    {
      provide: APP_FILTER,
      useClass: TypeORMErrorFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [Logger],
})
export class AppModule {}
