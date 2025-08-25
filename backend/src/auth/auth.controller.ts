import { Controller, Get, Post, Put, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkGuard } from './clerk.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sync')
  @UseGuards(ClerkGuard)
  async syncUser(@Request() req) {
    const userId = req.user.id;
    return await this.authService.syncUserWithDatabase(userId);
  }

  @Get('profile')
  @UseGuards(ClerkGuard)
  async getUserProfile(@Request() req) {
    const userId = req.user.id;
    return await this.authService.getUserProfile(userId);
  }

  @Put('profile')
  @UseGuards(ClerkGuard)
  async updateUserProfile(@Request() req, @Body() updateData: any) {
    const userId = req.user.id;
    return await this.authService.updateUserProfile(userId, updateData);
  }

  @Get('me')
  @UseGuards(ClerkGuard)
  async getCurrentUser(@Request() req) {
    return req.user;
  }
}
