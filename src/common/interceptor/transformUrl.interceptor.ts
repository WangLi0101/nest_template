import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SystemService } from 'src/system/system.service';

@Injectable()
export class TransformUrlInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly systemService: SystemService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap(async (data) => {
        const http = context.switchToHttp();
        const request = http.getRequest();

        if (request.url.includes('list') && Array.isArray(data.list)) {
          // 使用 Promise.all 等待所有异步操作完成
          const list = await Promise.all(
            data.list.map(async (item: { thumbnail: string }) => {
              const thumbnailUrl = await this.systemService.getOssUrl(
                item.thumbnail,
              );
              return {
                ...item,
                thumbnail: thumbnailUrl, // 确保 thumbnail 是字符串 URL
              };
            }),
          );
          return { list, total: data.total };
        } else if (data.thumbnail) {
          const thumbnailUrl = await this.systemService.getOssUrl(
            data.thumbnail,
          );
          return {
            ...data,
            thumbnail: thumbnailUrl, // 确保 thumbnail 是字符串 URL
          };
        }

        // 如果没有 thumbnail 字段，直接返回数据
        return data;
      }),
    );
  }
}
