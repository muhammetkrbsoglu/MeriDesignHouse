import { Injectable } from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private clerkService: ClerkService,
    private prisma: PrismaService,
  ) {}

  async syncUserWithDatabase(clerkUserId: string) {
    try {
      console.log('Syncing user with database for Clerk ID:', clerkUserId);
      
      // Get user from Clerk
      const clerkUser = await this.clerkService.getUserById(clerkUserId);
      console.log('Clerk user data:', clerkUser);
      
      // Check if user exists in our database
      let user = await this.prisma.user.findUnique({
        where: { id: clerkUserId },
      });

      if (!user) {
        console.log('Creating new user in database...');
        // Create new user in our database
        user = await this.prisma.user.create({
          data: {
            id: clerkUserId,
            email: clerkUser.email,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            phoneNumber: clerkUser.phoneNumber,
          },
        });
        console.log('New user created:', user.id);
      } else {
        console.log('Updating existing user in database...');
        // Update existing user
        user = await this.prisma.user.update({
          where: { id: clerkUserId },
          data: {
            email: clerkUser.email,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            phoneNumber: clerkUser.phoneNumber,
          },
        });
        console.log('User updated:', user.id);
      }

      return user;
    } catch (error) {
      console.error('Error in syncUserWithDatabase:', error);
      throw new Error(`Failed to sync user: ${error.message}`);
    }
  }

  async getUserProfile(userId: string) {
    try {
      console.log('Getting user profile for ID:', userId);
      
      let user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          addresses: true,
          orders: {
            include: {
              orderItems: {
                include: {
                  product: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!user) {
        console.log('User not found in database, syncing from Clerk...');
        // User doesn't exist in database, sync from Clerk first
        await this.syncUserWithDatabase(userId);
        
        // Get user with relations after sync
        user = await this.prisma.user.findUnique({
          where: { id: userId },
          include: {
            addresses: true,
            orders: {
              include: {
                orderItems: {
                  include: {
                    product: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        });
      }

      if (!user) {
        throw new Error('User not found after sync');
      }

      console.log('User profile retrieved successfully:', user.id);
      return user;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  async updateUserProfile(userId: string, updateData: any) {
    try {
      console.log('Updating user profile for ID:', userId, 'with data:', updateData);
      
      // First check if user exists, if not sync from Clerk
      let user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.log('User not found in database, syncing from Clerk...');
        // User doesn't exist in database, sync from Clerk first
        await this.syncUserWithDatabase(userId);
      }

      const { firstName, lastName, phoneNumber } = updateData;
      
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          phoneNumber: phoneNumber || undefined,
        },
        include: {
          addresses: true,
          orders: {
            include: {
              orderItems: {
                include: {
                  product: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      console.log('User profile updated successfully:', updatedUser.id);
      return updatedUser;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
  }
}
