import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkService {
  constructor(private configService: ConfigService) {}

  private getJwtKey(): string {
    const key = this.configService.get<string>('CLERK_SECRET_KEY');
    if (!key) {
      throw new Error('CLERK_SECRET_KEY is not configured');
    }
    return key;
  }

  async getUserById(userId: string) {
    try {
      console.log('Getting user from Clerk for ID:', userId);
      const user = await clerkClient.users.getUser(userId);
      console.log('Clerk user retrieved:', user.id);
      
      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumbers[0]?.phoneNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.error('Error getting user from Clerk:', error);
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async verifyToken(token: string) {
    try {
      console.log('Verifying Clerk token...');
      // JWT token'ı doğrula
      const decoded = await clerkClient.verifyToken(token);
      console.log('Token verified successfully, user ID:', decoded.sub);
      return decoded;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  }) {
    try {
      const user = await clerkClient.users.createUser({
        emailAddress: [userData.email],
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber ? [userData.phoneNumber] : undefined,
      });
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}
