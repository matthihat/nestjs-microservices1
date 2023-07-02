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
    const status = this.getStatus(exception);
    const logMessage = this.getLogMessage(exception);

    this.logger.error(logMessage);

    const responseMessage = this.getResponseMessage(
      exception,
      status,
      request.url,
    );

    response.status(status).json(responseMessage);
  }

  private getStatus(exception: unknown): number {
    return exception instanceof HttpException ? exception.getStatus() : 500;
  }

  private getLogMessage(exception: unknown): string {
    if (exception instanceof BaseException) {
      return `\nMessage: ${exception.message}\nException: ${exception.name}\nOrigin: ${exception.origin}\nStack: ${exception.stack}`;
    }
    return 'An error occurred ' + SERVICENAME;
  }

  private getResponseMessage(
    exception: unknown,
    status: number,
    url: string,
  ): object {
    const baseResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: url,
    };

    if (exception instanceof BaseException) {
      baseResponse['origin'] = exception.origin;
      if (process.env.NODE_ENV === 'development') {
        baseResponse['stack'] = exception.stack;
      }
    } else {
      baseResponse['origin'] = 'MICROSERVICE 1';
    }

    return baseResponse;
  }
}
