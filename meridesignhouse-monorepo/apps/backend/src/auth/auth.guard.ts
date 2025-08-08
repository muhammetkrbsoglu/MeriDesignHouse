import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { verifyToken } from '@clerk/backend';
import { UserService } from '../user/user.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers['authorization'] || request.headers['Authorization'] || '';
    const token = Array.isArray(authHeader)
      ? authHeader[0]
      : (authHeader as string).startsWith('Bearer ')
        ? (authHeader as string).slice('Bearer '.length)
        : '';

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const verification = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
        audience: process.env.CLERK_JWT_AUDIENCE,
        authorizedParties: process.env.CLERK_JWT_AUTHORIZED_PARTIES
          ? process.env.CLERK_JWT_AUTHORIZED_PARTIES.split(',')
          : undefined,
      });

      const clerkUserId = verification.sub as string;

      const dbUser = await this.userService.findByClerkId(clerkUserId);
      if (!dbUser) {
        throw new UnauthorizedException('User not found');
      }

      (request as any).user = dbUser;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}


