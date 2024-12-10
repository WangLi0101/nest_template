import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { AlyService } from 'src/common/service/aly.service';

@Module({
  controllers: [SystemController],
  providers: [SystemService, AlyService],
  exports: [SystemService],
})
export class SystemModule {}
