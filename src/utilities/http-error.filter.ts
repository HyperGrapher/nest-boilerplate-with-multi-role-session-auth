import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';


@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    let status = 500;
    try {
      // Bazi durumlarda getStatus is not a function hatasi veriyor
      // Ve hata donmediginden server askida kaliyor
      // Try catch ile bu onlenebiliyor
      status = exception.getStatus();
    } catch (error) {
      status = 500;
    }

    const fulldate = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

    let errType = 'error';
    if (exception.message === 'Forbidden resource') {
      errType = 'warn';
    }

    const errorResponse = {
      error: true,
      timestamp: fulldate,
      path: req.url,
      method: req.method,
      message: exception.message || null,
    };

    // Log error to console
    switch (errType) {
      case 'error':
        Logger.error(
          `${req.method} ${req.url}`,
          JSON.stringify(errorResponse),
          'ExceptionFilter',
        );
        break;
      case 'warn':
        Logger.warn(
          `${req.method} ${req.url}`,
          JSON.stringify(errorResponse.message),
          'ExceptionFilter',
        );
        break;

      default:
        break;
    }

    res.status(status).json(errorResponse);
  }
}
