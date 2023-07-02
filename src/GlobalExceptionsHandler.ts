import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SERVICENAME } from './constants';
import { WinstonLogger } from '@matthihat/customlogger/dist';
import { BaseException } from '@matthihat/custommodels/dist/exceptions/baseException';

@Catch()
export class GlobalExceptionsHandler implements ExceptionFilter {
  constructor(private logger: WinstonLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (exception instanceof BaseException) {
      this.logger.error(
        `\nMessage: ${exception.message}\nException: ${exception.name}\nOrigin: ${exception.origin}\nStack: ${exception.stack}`,
      );
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        origin: exception.origin,
      });
    } else {
      this.logger.error('An error occurred', SERVICENAME);
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        origin: 'MICROSERVICE 1',
      });
    }
  }
}
