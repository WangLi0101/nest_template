import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { UuidService } from './uuid.service';
import { Cache } from 'types';
@Injectable()
export class CaptchaService {
  private readonly config = {
    size: 4, // 验证码长度
    noise: 2, // 干扰线条数
    color: true, // 验证码字符是否有颜色
    width: 120,
    height: 40,
    // background: '#cc9966', // 背景颜色
    // 可以配置中文验证码
  };

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly uuidService: UuidService,
  ) {}

  async createCode() {
    const captcha = svgCaptcha.create(this.config);
    const codeId = this.uuidService.createUuid();
    await this.cacheManager.set(codeId, captcha.text, { ttl: 10 }, '');
    return { codeId, code: captcha.data };
  }
}
