import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeORMErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  private getMessage(exception: QueryFailedError<any>) {
    let msg = '';
    switch (exception.driverError.errno) {
      case 1062:
        msg = '唯一索引冲突';
        break;
      default:
        msg = exception.driverError.message;
    }
    return msg;
  }
  catch(exception: QueryFailedError<any>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = 400;
    const responseData = {
      code: status,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      message: this.getMessage(exception),
    };
    this.logger.error(responseData);
    response.status(status).json(responseData);
  }
}
