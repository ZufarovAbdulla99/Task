import { SetMetadata } from '@nestjs/common';

export const IS_OWNER_KEY = 'isOwnerModelAndField';

export const IsOwner = (model: any, field: string = 'createdBy') =>
  SetMetadata(IS_OWNER_KEY, { model, field });
