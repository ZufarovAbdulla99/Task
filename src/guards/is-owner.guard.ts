import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_OWNER_KEY } from '../decorators/is-owner.decorator';
import { ModuleRef } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const resourceId = request.params.id;

    if (!userId) throw new ForbiddenException('User ID not found');
    if (!resourceId) throw new ForbiddenException('Resource ID not found');

    const metadata = this.reflector.get<{ model: any; field: string }>(
      IS_OWNER_KEY,
      context.getHandler(),
    );

    if (!metadata) return true;

    const { model, field } = metadata;
    const modelToken = getModelToken(model.name);
    const modelInstance = this.moduleRef.get(modelToken, { strict: false });

    const resource = await modelInstance.findById(resourceId).lean();
    if (!resource) throw new NotFoundException('Resource not found');

    const ownerField = field || 'createdBy';
    if (resource[ownerField].toString() !== userId.toString()) {
      throw new ForbiddenException('You are not the owner of this resource');
    }

    return true;
  }
}