import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles) {
      return true; // No roles are required, so access is granted
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming the user information is stored in the request

    // Check if the user's role matches one of the required roles
    return requiredRoles.includes(user.role);
  }
}