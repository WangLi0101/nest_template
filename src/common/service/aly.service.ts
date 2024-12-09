import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OSS from 'ali-oss';
import { OSSEnum } from 'types/config.enum';
@Injectable()
export class AlyService {
  private ossClient: any;
  constructor(configService: ConfigService) {
    this.ossClient = new OSS({
      region: 'oss-cn-beijing',
      accessKeyId: configService.get(OSSEnum.OSS_ACCESS_KEY_ID) as string,
      accessKeySecret: configService.get(
        OSSEnum.OSS_ACCESS_KEY_SECRET,
      ) as string,
      bucket: 'betterme-blog',
    });
  }

  // 获取临时授权
  async getTemporaryAuthorization() {
    const policy = {
      expiration: new Date(Date.now() + 3600 * 1000).toISOString(),
      conditions: [
        ['content-length-range', 0, 1048576000],
        { bucket: this.ossClient.options.bucket },
      ],
    };

    const formData = await this.ossClient.calculatePostSignature(policy);

    return {
      host: `https://${this.ossClient.options.bucket}.${this.ossClient.options.region}.aliyuncs.com`,
      accessId: this.ossClient.options.accessKeyId,
      policy: formData.policy,
      signature: formData.Signature,
      expire: formData.expire,
    };
  }
}
