import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseGuards, 
  Req,
  Put,
  Query
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';
import { ClerkGuard } from '../clerk/clerk.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(ClerkGuard)
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const userId = req.user?.sub;
    return await this.ordersService.createOrder(userId, createOrderDto);
  }

  @Post('guest')
  async createGuestOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.createOrder(null, createOrderDto);
  }

  @Get(':orderId')
  @UseGuards(ClerkGuard)
  async getOrder(@Param('orderId') orderId: string, @Req() req: any) {
    const userId = req.user?.sub;
    return await this.ordersService.getOrder(orderId, userId);
  }

  @Get('guest/:orderId')
  async getGuestOrder(
    @Param('orderId') orderId: string,
    @Query('phoneNumber') phoneNumber: string
  ) {
    return await this.ordersService.getGuestOrder(orderId, phoneNumber);
  }

  @Get('user/me')
  @UseGuards(ClerkGuard)
  async getUserOrders(@Req() req: any) {
    const userId = req.user?.sub;
    return await this.ordersService.getUserOrders(userId);
  }

  @Put(':orderId/status')
  @UseGuards(ClerkGuard)
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() body: { status: string }
  ) {
    return await this.ordersService.updateOrderStatus(orderId, body.status);
  }
}
