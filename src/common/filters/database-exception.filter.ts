import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  LoggerService,
  HttpStatus,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeORMErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  // 获取错误消息
  private getMessage(exception: TypeORMError): string {
    if (exception instanceof QueryFailedError) {
      const driverError = exception.driverError;
      if (driverError && driverError.errno) {
        switch (driverError.errno) {
          case 1062:
            return '唯一索引冲突'; // 唯一索引冲突
          // 可根据需要添加更多的错误码处理
          default:
            return driverError.message || '数据库查询失败';
        }
      }
      return '数据库查询失败';
    }
    // 处理其他类型的 TypeORMError
    return exception.message || '数据库错误';
  }

  // 获取 HTTP 状态码
  private getStatusCode(exception: TypeORMError): number {
    if (exception instanceof QueryFailedError) {
      const driverError = exception.driverError;
      if (driverError && driverError.errno === 1062) {
        return HttpStatus.CONFLICT; // 409 冲突
      }
      return HttpStatus.BAD_REQUEST; // 400 请求错误
    }
    // 其他 TypeORMError 返回 500 内部服务器错误
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const message = this.getMessage(exception);
    const status = this.getStatusCode(exception);

    const responseData = {
      code: status,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      message,
    };

    // 记录详细的错误日志，包括堆栈信息
    this.logger.error({
      message: 'TypeORMError',
      error: responseData,
      stack: exception.stack,
      body: request.body,
    });

    response.status(status).json(responseData);
  }
}
