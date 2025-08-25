import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Req
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto';
import { ClerkGuard } from '../clerk/clerk.guard';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @UseGuards(ClerkGuard)
  async getWishlist(@Req() req: any) {
    const userId = req.user?.sub;
    console.log('[WishlistController] getWishlist', { userId });
    return await this.wishlistService.getWishlist(userId);
  }

  @Post()
  @UseGuards(ClerkGuard)
  async addToWishlist(@Body() addToWishlistDto: AddToWishlistDto, @Req() req: any) {
    const userId = req.user?.sub;
    console.log('[WishlistController] addToWishlist', { userId, body: addToWishlistDto });
    return await this.wishlistService.addToWishlist(userId, addToWishlistDto);
  }

  @Delete(':productId')
  @UseGuards(ClerkGuard)
  async removeFromWishlist(@Param('productId') productId: string, @Req() req: any) {
    const userId = req.user?.sub;
    console.log('[WishlistController] removeFromWishlist', { userId, productId });
    return await this.wishlistService.removeFromWishlist(userId, productId);
  }
}
