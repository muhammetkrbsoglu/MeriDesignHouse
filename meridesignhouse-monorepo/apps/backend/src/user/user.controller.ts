import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';

@Controller('users')
export class UserController {
  @Get('me')
  getMe(@Req() req: Request) {
    // AuthGuard attaches the database user object to request
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (req as any).user ?? null;
  }
}
