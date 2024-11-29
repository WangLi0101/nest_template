import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/database/roles.entity';
import { User } from 'src/database/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, User])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
