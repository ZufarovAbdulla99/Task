import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const requestTime = new Date().toISOString();

    if (exception instanceof HttpException) {
      // console.log(exception, "*")
      return response.status(exception.getStatus()).json({
        message: exception.message,
        requestTime,
        url: request.url,
        errorName: exception.name,
        statusCode: exception.getStatus(),
      });
    }

    if (exception?.code === 11000) {
      return response.status(400).json({
        message: 'Duplicate key error',
        requestTime,
        url: request.url,
        error: exception.keyValue,
        errorName: exception.name,
        statusCode: 400,
      });
    }

    return response.status(500).json({
      message: exception?.message || 'Internal server error',
      requestTime,
      url: request.url,
      errorName: exception?.name,
      statusCode: 500,
    });
  }
}
