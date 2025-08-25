import { 
  Controller, 
  Post, 
  Body, 
  UseGuards,
  Req,
  Get,
  Param
} from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { ClerkGuard } from '../clerk/clerk.guard';

interface SendMessageDto {
  phoneNumber: string;
  message: string;
}

interface SendOrderNotificationDto {
  phoneNumber: string;
  orderId: string;
  orderData: any;
}

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  @Post('send-message')
  @UseGuards(ClerkGuard)
  async sendCustomMessage(@Body() sendMessageDto: SendMessageDto) {
    const { phoneNumber, message } = sendMessageDto;
    
    // Validate phone number
    if (!this.whatsAppService.validatePhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    const formattedPhone = this.whatsAppService.formatPhoneNumber(phoneNumber);
    return await this.whatsAppService.sendCustomMessage(formattedPhone, message);
  }

  @Post('send-order-confirmation')
  @UseGuards(ClerkGuard)
  async sendOrderConfirmation(@Body() sendOrderNotificationDto: SendOrderNotificationDto) {
    const { phoneNumber, orderData } = sendOrderNotificationDto;
    
    if (!this.whatsAppService.validatePhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    const formattedPhone = this.whatsAppService.formatPhoneNumber(phoneNumber);
    return await this.whatsAppService.sendOrderConfirmation(formattedPhone, orderData);
  }

  @Post('send-order-status-update')
  @UseGuards(ClerkGuard)
  async sendOrderStatusUpdate(
    @Body() body: { phoneNumber: string; orderData: any; newStatus: string }
  ) {
    const { phoneNumber, orderData, newStatus } = body;
    
    if (!this.whatsAppService.validatePhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    const formattedPhone = this.whatsAppService.formatPhoneNumber(phoneNumber);
    return await this.whatsAppService.sendOrderStatusUpdate(formattedPhone, orderData, newStatus);
  }

  @Post('send-shipping-notification')
  @UseGuards(ClerkGuard)
  async sendShippingNotification(
    @Body() body: { phoneNumber: string; orderData: any; trackingInfo?: any }
  ) {
    const { phoneNumber, orderData, trackingInfo } = body;
    
    if (!this.whatsAppService.validatePhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    const formattedPhone = this.whatsAppService.formatPhoneNumber(phoneNumber);
    return await this.whatsAppService.sendShippingNotification(formattedPhone, orderData, trackingInfo);
  }

  @Post('send-delivery-confirmation')
  @UseGuards(ClerkGuard)
  async sendDeliveryConfirmation(@Body() sendOrderNotificationDto: SendOrderNotificationDto) {
    const { phoneNumber, orderData } = sendOrderNotificationDto;
    
    if (!this.whatsAppService.validatePhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    const formattedPhone = this.whatsAppService.formatPhoneNumber(phoneNumber);
    return await this.whatsAppService.sendDeliveryConfirmation(formattedPhone, orderData);
  }

  @Get('validate-phone/:phoneNumber')
  async validatePhoneNumber(@Param('phoneNumber') phoneNumber: string) {
    const isValid = this.whatsAppService.validatePhoneNumber(phoneNumber);
    const formatted = isValid ? this.whatsAppService.formatPhoneNumber(phoneNumber) : null;
    
    return {
      isValid,
      formatted,
      original: phoneNumber
    };
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'WhatsApp Service',
      timestamp: new Date().toISOString()
    };
  }
}
