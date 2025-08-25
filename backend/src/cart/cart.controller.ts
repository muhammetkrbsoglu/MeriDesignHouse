import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Req,
  Query
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
import { ClerkGuard } from '../clerk/clerk.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(ClerkGuard)
  async addToCart(@Body() addToCartDto: AddToCartDto, @Req() req: any) {
    const userId = req.user?.sub;
    console.log('[CartController] addToCart', { userId, body: addToCartDto });
    return await this.cartService.addToCart(userId, addToCartDto);
  }

  @Get()
  @UseGuards(ClerkGuard)
  async getCart(@Req() req: any) {
    const userId = req.user?.sub;
    
    return await this.cartService.getCart(userId);
  }

  @Get('count')
  @UseGuards(ClerkGuard)
  async getCartItemCount(@Req() req: any) {
    const userId = req.user?.sub;
    
    return await this.cartService.getCartItemCount(userId);
  }

  @Put(':itemId')
  @UseGuards(ClerkGuard)
  async updateCartItem(
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateCartItemDto,
    @Req() req: any
  ) {
    const userId = req.user?.sub;
    
    return await this.cartService.updateCartItem(itemId, userId, updateDto);
  }

  @Delete(':itemId')
  @UseGuards(ClerkGuard)
  async removeFromCart(
    @Param('itemId') itemId: string,
    @Req() req: any
  ) {
    const userId = req.user?.sub;
    
    return await this.cartService.removeFromCart(itemId, userId);
  }

  @Delete()
  @UseGuards(ClerkGuard)
  async clearCart(@Req() req: any) {
    const userId = req.user?.sub;
    
    return await this.cartService.clearCart(userId);
  }
}
