import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryBlogDto {
  @IsNumber()
  page: number;

  @IsNumber()
  pageSize: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  tagId: number | null;
}
