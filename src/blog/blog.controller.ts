import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { TokenPayload } from 'types';
import { QueryBlogDto } from './dto/blog.dto';
import { JwtPayload } from 'src/common/decorator/jwtPayload.decorator';
import { TransformUrlInterceptor } from 'src/common/interceptor/transformUrl.interceptor';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(
    @Body() createBlogDto: CreateBlogDto,
    @JwtPayload() JwtPayload: TokenPayload,
  ) {
    return this.blogService.create(createBlogDto, JwtPayload);
  }

  @Post('list')
  @UseInterceptors(TransformUrlInterceptor)
  findAll(@Body() query: QueryBlogDto) {
    return this.blogService.findAll(query);
  }

  @Get(':id')
  @UseInterceptors(TransformUrlInterceptor)
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
