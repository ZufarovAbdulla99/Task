import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/decorators/role.decorator';
import { RequestInterface } from './check-auth.guard';

@Injectable()
export class CheckRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RequestInterface>();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    if (!roles.includes(request.role)) {
      throw new NotAcceptableException(
        "User don't have permission to this endpoint",
      );
    }

    return true;
  }
}