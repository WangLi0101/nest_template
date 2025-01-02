import { Controller, Post, Body } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { CreateSignDto } from './dto/create-livekit.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiResponse } from '@nestjs/swagger';

@Controller('livekit')
export class LivekitController {
  constructor(private readonly livekitService: LivekitService) {}

  @Public()
  @Post('sign')
  @ApiResponse({ type: String })
  create(@Body() createLivekitDto: CreateSignDto): Promise<string> {
    return this.livekitService.createSign(createLivekitDto);
  }
}
