import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log(request);

    if (!request.isAuthenticated()) {
      throw new HttpException('Unauthorized request', HttpStatus.UNAUTHORIZED);
    }

    return request.isAuthenticated();
  }
}
