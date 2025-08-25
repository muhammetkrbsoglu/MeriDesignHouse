import { Injectable } from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkService {
  constructor(private configService: ConfigService) {}

  async getUserById(userId: string) {
    try {
      return await clerkClient.users.getUser(userId);
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async verifyToken(token: string) {
    try {
      return await clerkClient.verifyToken(token);
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  async createUser(userData: any) {
    try {
      return await clerkClient.users.createUser(userData);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  private getJwtKey(): string {
    return this.configService.get<string>('CLERK_SECRET_KEY') || '';
  }
}
