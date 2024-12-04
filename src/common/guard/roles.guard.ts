import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthRoles } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private matchRoles(roles: string[], userRoles: string[]) {
    return roles.some((el) => userRoles.includes(el));
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(AuthRoles, context.getHandler());
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const userRoles = request.user.roles;
    const isAuth = this.matchRoles(roles, userRoles);
    if (!isAuth) throw new HttpException('无权限', HttpStatus.FORBIDDEN);
    return true;
  }
}
