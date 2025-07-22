import {
  BadRequestException,
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import {
  JsonWebTokenError,
  JwtService,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Protected } from 'src/decorators/protected.decorator';
import { UserRole } from 'src/modules/user/enums/role.enum';

export declare interface RequestInterface extends Request {
  userId: string | undefined;
  role: string | undefined;
}

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<RequestInterface>();

    const isProtected = this.reflector.get<boolean>(
      Protected,
      context.getHandler(),
    );

    if (!isProtected) {
      // NOTE: Agar endpoint himoyalanmagan bo‘lsa, default role sifatida student beriladi
      request.role = UserRole.Student;
      return true;
    }

    const bearerToken = request.headers['authorization'];

    if (
      !(
        bearerToken &&
        bearerToken.startsWith('Bearer') &&
        bearerToken.split('Bearer ')[1]?.length
      )
    ) {
      throw new BadRequestException('Please provide valid bearer token');
    }

    const token = bearerToken.split('Bearer ')[1];

    let decoded: any;
    try {
      decoded = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      });
    } catch (error) {
      // FIXME: Turli xatoliklar uchun alohida xabarlar
      if (error instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Token already expired');
      }

      if (error instanceof NotBeforeError) {
        throw new ConflictException('Token not before error');
      }

      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException(error.message);
      }

      return false;
    }

    // NOTE: Token payloadda `userId` bo'lishi kerak
    request.userId = decoded?.userId;
    request.role = decoded?.role;

    return true;
  }
}
