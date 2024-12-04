import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService } from './bcrypt.service';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { CaptchaService } from './captcha.service';
import { UuidService } from './uuid.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UserController],
  providers: [UserService, BcryptService, CaptchaService, UuidService],
})
export class UserModule {}
