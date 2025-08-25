import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { AddToWishlistDto } from './dto';
import { ClerkService } from '../clerk/clerk.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService, private clerkService: ClerkService) {}

  private async ensureUserExists(userId: string | null): Promise<void> {
    if (!userId) return;
    const existing = await this.prisma.user.findUnique({ where: { id: userId } });
    if (existing) return;
    
    try {
      const clerkUser = await this.clerkService.getUserById(userId);
      const primaryEmail = clerkUser?.emailAddresses?.[0]?.emailAddress || `${userId}@placeholder.local`;
      const firstName = clerkUser?.firstName || '';
      const lastName = clerkUser?.lastName || '';

      await this.prisma.user.upsert({
        where: { id: userId },
        create: {
          id: userId,
          email: primaryEmail,
          firstName,
          lastName,
        },
        update: {},
      });
    } catch {
      await this.prisma.user.upsert({
        where: { id: userId },
        create: {
          id: userId,
          email: `${userId}@placeholder.local`,
          firstName: '',
          lastName: '',
        },
        update: {},
      });
    }
  }

  async getWishlist(userId: string | null) {
    console.log('[WishlistService] getWishlist called', { userId });
    
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    await this.ensureUserExists(userId);

    const wishlistItems = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      items: wishlistItems,
      itemCount: wishlistItems.length
    };
  }

  async addToWishlist(userId: string | null, addToWishlistDto: AddToWishlistDto) {
    console.log('[WishlistService] addToWishlist called', { userId, addToWishlistDto });
    
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const { productId } = addToWishlistDto;

    await this.ensureUserExists(userId);

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, isActive: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not active');
    }

    // Check if already in wishlist
    const existingItem = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existingItem) {
      throw new BadRequestException('Product is already in wishlist');
    }

    // Add to wishlist
    return await this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: { category: true }
        }
      }
    });
  }

  async removeFromWishlist(userId: string | null, productId: string) {
    console.log('[WishlistService] removeFromWishlist called', { userId, productId });
    
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    // Check if item exists in wishlist
    const wishlistItem = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    // Remove from wishlist
    await this.prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    return { message: 'Item removed from wishlist' };
  }
}
