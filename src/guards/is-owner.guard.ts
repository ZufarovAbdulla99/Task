import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestInterface } from './check-auth.guard';
import { IsOwner } from 'src/decorators/is-owner.decorator';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestInterface>();
    const isOwnerProtected = this.reflector.get<boolean>(
      IsOwner,
      context.getHandler(),
    );

    if (!isOwnerProtected) return true;

    const paramId = request.params.id;

    if (!paramId || !request.userId) {
      throw new ForbiddenException('Access denied: no ID or user info');
    }

    if (paramId !== request.userId) {
      throw new ForbiddenException("Siz faqat o'z ma'lumotlaringizni ko‘rishingiz mumkin");
    }

    return true;
  }
}
