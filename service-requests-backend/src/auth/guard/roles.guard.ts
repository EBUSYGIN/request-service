import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<{
      user?: { id: number; role?: string };
    }>();

    const user = request.user;

    console.log('ROLES GUARD requiredRoles =', requiredRoles);
    console.log('ROLES GUARD user =', user);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const userRole = user?.role;
    const result = !!userRole && requiredRoles.includes(userRole);

    console.log('ROLES GUARD decision =', result);

    return result;
  }
}
