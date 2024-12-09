import { IsNumber, IsString } from 'class-validator';

export class QueryBlogDto {
  @IsNumber()
  page: number;

  @IsNumber()
  pageSize: number;

  @IsString()
  title: string;
}
