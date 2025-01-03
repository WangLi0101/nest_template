import { Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from './logs/logs.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { connectionParams } from 'ormconfig';
import { TypeORMErrorFilter } from './common/filters/database-exception.filter';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './roles/roles.module';
import jwtConstants from './utils/jwtConstants';
import { AuthGuard } from './common/guard/auth.guard';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { RolesGuard } from './common/guard/roles.guard';
import { MenuModule } from './menu/menu.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisEnum } from 'types/config.enum';
import { redisStore } from 'cache-manager-redis-store';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { TagsModule } from './tags/tags.module';
import { BlogModule } from './blog/blog.module';
import { SystemModule } from './system/system.module';
import { LivekitModule } from './livekit/livekit.module';
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
      signOptions: { expiresIn: '3d' },
    }),
    //redis缓存
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          store: await redisStore({
            socket: {
              host: configService.get(RedisEnum.REDIS_HOST),
              port: configService.get(RedisEnum.REDIS_PORT),
            },
            password: configService.get(RedisEnum.REDIS_PASSWORD),
            ttl: 60,
          }),
        } as any;
      },
    }),
    // 定时任务
    ScheduleModule.forRoot(),
    TasksModule,
    UserModule,
    LogsModule,
    RolesModule,
    MenuModule,
    TagsModule,
    BlogModule,
    SystemModule,
    LivekitModule,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [Logger],
})
export class AppModule {}
