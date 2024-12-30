import { IsNotEmpty } from 'class-validator';

export class CreateSignDto {
  @IsNotEmpty()
  roomName: string;
  @IsNotEmpty()
  username: string;
}
