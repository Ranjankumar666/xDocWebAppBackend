import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class UnhandledExceptionFilter extends BaseExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: exception.message,
            timeStamp: new Date().toISOString(),
        });
    }
}
