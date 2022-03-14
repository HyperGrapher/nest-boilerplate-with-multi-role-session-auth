import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  Logger,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logs requests into terminal
 * also saves page visits
 *
 * Decorate a controller with @UseInterceptors(new LoggingInterceptor())
 * And it will log all request for that Controller
 * 
 * Or you can use it application wide by adding to app module providers
 providers: [
		AppService,
		{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
	],
 */

  // Rroute list to intercept
const logPaths = [
  '/auth/customer/register',
  '/auth/store/register',
  '/auth/admin/register',
];

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;

    if (logPaths.includes(req.route.path)) {
      Logger.log('🎯 Intercepted route', 'LoggingInterceptor');

      const param = req.params.id;

      // if requesting user authenticated
      // get the claims and save them
      if (req.headers.authorization) {
        // TODO cookie parse
        const claims = parseJwt(req.headers.authorization);
        console.log(req.headers);

        // admin requests are skipped
        if (claims.currentRole !== 'admin') {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const obj = {
            email: claims.email,
            visiter: claims.id,
            path: req.route.path,
            role: claims.currentRole,
            profile: param,
          };

          // saveRequest(obj); // TODO
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const obj = {
          email: null,
          visiter: null,
          path: req.route.path,
          role: 'anonymous',
          profile: param,
        };
        // saveRequest(obj); // TODO
      }
    }

    return next.handle().pipe(
      tap(() => {
        Logger.log(
          `${method} ${url} ${Date.now() - now}ms`,
          context.getClass().name,
        );
      }),
    );
  }
}

/**
 * Extract JWT encoded data
 */
function parseJwt(token) {
  const clean = token.substr(7); // Remove 'Bearer'
  const base64Url = clean.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const decodedData = JSON.parse(
    Buffer.from(base64, 'base64').toString('binary'),
  );

  return decodedData;
}
