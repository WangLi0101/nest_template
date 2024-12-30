import { Controller, Post, Body } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { CreateSignDto } from './dto/create-livekit.dto';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('livekit')
export class LivekitController {
  constructor(private readonly livekitService: LivekitService) {}

  @Post('sign')
  @Public()
  create(@Body() createLivekitDto: CreateSignDto) {
    return this.livekitService.createSign(createLivekitDto);
  }
}
