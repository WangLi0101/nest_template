import { Body, Controller, Get, Post } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('oss/sign')
  findOne() {
    return this.systemService.getOssSign();
  }

  @Post('oss/url')
  getOssUrl(@Body() body: { url: string }) {
    return this.systemService.getOssUrl(body.url);
  }
}
