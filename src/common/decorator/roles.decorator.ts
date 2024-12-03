import { Reflector } from '@nestjs/core';

export const AuthRoles = Reflector.createDecorator<string[]>();
