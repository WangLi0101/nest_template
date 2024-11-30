import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  catch(exception: HttpException | BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    let message = '';

    if (exception instanceof BadRequestException) {
      message = (exception.getResponse() as any).message.toString();
    } else {
      message = exception.message;
    }
    const responseData = {
      code: status,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      message,
    };
    this.logger.error(responseData);

    response.status(status).json(responseData);
  }
}
