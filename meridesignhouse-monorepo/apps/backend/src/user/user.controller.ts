import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@Req() req: Request) {
    // AuthGuard attaches the database user object to request
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (req as any).user ?? null;
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAll(
    @Query('search') search?: string,
    @Query('role') role: string = 'all',
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ) {
    const page = Number.parseInt(pageRaw ?? '1', 10);
    const limit = Number.parseInt(limitRaw ?? '10', 10);

    const { users, totalCount } = await this.userService.findAll({
      search,
      role,
      page: Number.isNaN(page) ? 1 : page,
      limit: Number.isNaN(limit) ? 10 : limit,
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name:
        user.name ||
        user.firstName ||
        (user.email ? user.email.split('@')[0] : undefined) ||
        'Unknown User',
      role: user.role || 'user',
      joinedAt: user.createdAt,
      messageCount: (user._count?.sentMessages || 0) + (user._count?.receivedMessages || 0),
    }));

    return {
      users: formattedUsers,
      pagination: {
        page: Number.isNaN(page) ? 1 : page,
        limit: Number.isNaN(limit) ? 10 : limit,
        total: totalCount,
        pages: Math.ceil(totalCount / (Number.isNaN(limit) ? 10 : limit)),
      },
    };
  }
}
