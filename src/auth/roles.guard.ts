import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from 'src/dtos/user.dto';
import { RequestUser } from 'src/dtos/auth.dto';

@Injectable()
export class CustomerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: RequestUser = request.user;

    return user.role == UserRole.CUSTOMER;
  }
}

@Injectable()
export class StoreGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: RequestUser = request.user;

    return user.role == UserRole.STORE;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: RequestUser = request.user;

    return user.role == UserRole.ADMIN;
  }
}
