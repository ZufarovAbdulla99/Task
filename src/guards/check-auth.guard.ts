import {
  BadRequestException,
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import {
  JwtService,
  TokenExpiredError,
  NotBeforeError,
  JsonWebTokenError,
} from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PROTECTED_KEY } from 'src/decorators/protected.decorator';
import { UserRole } from 'src/modules/user/enums/role.enum';

export interface RequestInterface extends Request {
  userId?: string;
  role?: string;
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
    const request = context.switchToHttp().getRequest<RequestInterface>();

    const isProtected = this.reflector.getAllAndOverride<boolean>(
      PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isProtected === undefined || isProtected === false) {
      request.role = UserRole.Student;
      return true;
    }

    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new BadRequestException('Please provide a valid bearer token');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new BadRequestException('Invalid token format');
    }

    let decoded: any;

    try {
      decoded = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      });

      // console.log('Decoded token:', decoded); // Debug uchun
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Token expired');
      }

      if (error instanceof NotBeforeError) {
        throw new ConflictException('Token not active yet');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      throw new UnauthorizedException('Authentication failed');
    }

    // Token payload'dan userId va role'ni olish
    request.userId = decoded?.sub || decoded?.userId || decoded?.id;
    request.role = decoded?.role || UserRole.Student;

    // console.log('Set userId:', request.userId); // Debug uchun
    // console.log('Set role:', request.role); // Debug uchun

    if (typeof request.userId !== 'string') {
      throw new UnauthorizedException('Invalid user ID in token');
    }

    if (!request.userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return true;
  }
}
