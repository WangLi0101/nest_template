import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Tag } from 'src/tags/entities/tag.entity';
import { UserService } from 'src/user/user.service';
import { TokenPayload } from 'types';
import { QueryBlogDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly userService: UserService,
  ) {}
  async create(createBlogDto: CreateBlogDto, JwtPayload: TokenPayload) {
    const { tags, ...data } = createBlogDto;
    const blog = this.blogRepository.create(data);
    const tabs = await this.tagRepository.find({
      where: {
        id: In(tags),
      },
    });
    blog.tags = tabs;
    const user = await this.userService.findOne(JwtPayload.id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    blog.user = user;
    return this.blogRepository.save(blog);
  }

  async findAll(query: QueryBlogDto) {
    const { page, pageSize, title } = query;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const [list, total] = await this.blogRepository.findAndCount({
      where: {
        title: Like(`%${title}%`),
      },
      skip,
      take,
      relations: {
        user: true,
        tags: true,
      },
    });
    return {
      total,
      list,
    };
  }

  findOne(id: number) {
    return this.blogRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        tags: true,
      },
    });
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    // 更新博客
    const { tags, ...data } = updateBlogDto;
    const blog = await this.blogRepository.findOne({
      where: {
        id,
      },
    });
    if (!blog) {
      throw new NotFoundException('博客不存在');
    }
    if (tags) {
      const tabs = await this.tagRepository.find({
        where: {
          id: In(tags),
        },
      });
      blog.tags = tabs;
    }
    return this.blogRepository.save({ ...blog, ...data });
  }

  async remove(id: number) {
    const blob = await this.blogRepository.findOne({
      where: {
        id,
      },
    });
    if (!blob) {
      throw new NotFoundException('博客不存在');
    }
    return this.blogRepository.remove(blob);
  }
}
