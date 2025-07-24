import { SetMetadata } from '@nestjs/common';

export const PROTECTED_KEY = 'Protected';
export const Protected = (isProtected: boolean = true) => SetMetadata(PROTECTED_KEY, isProtected);