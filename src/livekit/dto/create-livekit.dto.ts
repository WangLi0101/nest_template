import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSignDto {
  @IsNotEmpty()
  @ApiProperty({ description: '房间名称' })
  roomName: string;
  @IsNotEmpty()
  @ApiProperty({ description: '用户名' })
  username: string;
}
