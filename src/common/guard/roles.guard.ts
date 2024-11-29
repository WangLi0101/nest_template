import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../decorator/roles.decorator';
import { TokenRoles } from 'types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private matchRoles(roles: string[], userRoles: TokenRoles) {
    const userRolesNameList = userRoles.map((el) => el.name);
    return roles.some((el) => userRolesNameList.includes(el));
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const userRoles = request.user;
    const isAuth = this.matchRoles(roles, userRoles);
    if (!isAuth) throw new HttpException('无权限', HttpStatus.FORBIDDEN);
    return true;
  }
}
