import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
console.log('currentEnv', envFilePath, process.env.NODE_ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
