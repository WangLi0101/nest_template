import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtPayload } from 'src/common/decorator/jwtPayload.decorator';
import { TokenPayload } from 'types';
import { QueryBlogDto } from './dto/blog.dto';
import { AlyService } from 'src/common/service/aly.service';

@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly alyService: AlyService,
  ) {}

  @Post()
  create(
    @Body() createBlogDto: CreateBlogDto,
    @JwtPayload() JwtPayload: TokenPayload,
  ) {
    return this.blogService.create(createBlogDto, JwtPayload);
  }

  @Post('list')
  findAll(@Body() query: QueryBlogDto) {
    return this.blogService.findAll(query);
  }

  @Get(':id')
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

  @Get('oss/sign')
  getOss() {
    return this.alyService.getTemporaryAuthorization();
  }
}
