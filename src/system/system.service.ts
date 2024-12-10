import { Injectable } from '@nestjs/common';
import { AlyService } from 'src/common/service/aly.service';

@Injectable()
export class SystemService {
  constructor(private readonly alyService: AlyService) {}

  getOssSign() {
    return this.alyService.getTemporaryAuthorization();
  }

  getOssUrl(url: string) {
    return this.alyService.addSignatureToUrl(url);
  }
}
