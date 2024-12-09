import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Blog } from './entities/blog.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { AlyService } from 'src/common/service/aly.service';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Tag, User]), UserModule],
  controllers: [BlogController],
  providers: [BlogService, AlyService],
})
export class BlogModule {}
