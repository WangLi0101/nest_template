import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Blog } from './entities/blog.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { SystemModule } from 'src/system/system.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, Tag, User]),
    UserModule,
    SystemModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
