import { Reflector } from '@nestjs/core';

export const IsOwner = Reflector.createDecorator<boolean>();