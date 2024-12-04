import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  component: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsOptional()
  icon: string;

  @IsBoolean()
  isHidden: boolean;

  @IsNumber()
  @IsOptional()
  parentId: number;

  @IsNumber()
  @IsOptional()
  sort: number;
}
