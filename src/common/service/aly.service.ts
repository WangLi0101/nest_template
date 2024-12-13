import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as OSS from 'ali-oss';
import { OSSEnum } from 'types/config.enum';
@Injectable()
export class AlyService {
  private ossClient: any;
  constructor(configService: ConfigService) {
    this.ossClient = new OSS({
      region: configService.get(OSSEnum.OSS_REGION),
      accessKeyId: configService.get(OSSEnum.OSS_ACCESS_KEY_ID) as string,
      accessKeySecret: configService.get(
        OSSEnum.OSS_ACCESS_KEY_SECRET,
      ) as string,
      bucket: configService.get(OSSEnum.OSS_BUCKET),
    });
  }

  // 获取临时授权
  async getTemporaryAuthorization() {
    const expiration = new Date(Date.now() + 10 * 60 * 1000); // 10分钟后过期

    const policy = {
      expiration: expiration.toISOString(),
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
      expire: Math.floor(expiration.getTime() / 1000), // 转换为秒级时间戳
    };
  }

  // url加上签名
  async addSignatureToUrl(url: string) {
    try {
      // 直接使用 ossClient 的 signatureUrl 方法
      const signedUrl = await this.ossClient.signatureUrl(url, {
        expires: 3600, // 1小时过期
      });
      return signedUrl;
    } catch (error) {
      throw new Error(`签名生成失败: ${error.message}`);
    }
  }
}
