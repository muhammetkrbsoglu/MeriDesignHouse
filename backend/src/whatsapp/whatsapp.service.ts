import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface WhatsAppMessage {
  messaging_product: string;
  to: string;
  type: string;
  text?: { body: string };
  template?: {
    name: string;
    language: { code: string };
    components?: any[];
  };
}

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly apiUrl: string;
  private readonly phoneNumberId: string;
  private readonly accessToken: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = 'https://graph.facebook.com/v18.0';
    this.phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID') || '';
    this.accessToken = this.configService.get<string>('WHATSAPP_API_TOKEN') || '';
  }

  async sendOrderConfirmation(phoneNumber: string, orderData: any) {
    try {
      const message = this.createOrderConfirmationMessage(phoneNumber, orderData);
      await this.sendMessage(message);
      
      this.logger.log(`Order confirmation sent to ${phoneNumber} for order ${orderData.orderId}`);
      return { success: true, message: 'Order confirmation sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send order confirmation: ${error.message}`);
      throw error;
    }
  }

  async sendOrderStatusUpdate(phoneNumber: string, orderData: any, newStatus: string) {
    try {
      const message = this.createOrderStatusUpdateMessage(phoneNumber, orderData, newStatus);
      await this.sendMessage(message);
      
      this.logger.log(`Order status update sent to ${phoneNumber} for order ${orderData.orderId}`);
      return { success: true, message: 'Order status update sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send order status update: ${error.message}`);
      throw error;
    }
  }

  async sendShippingNotification(phoneNumber: string, orderData: any, trackingInfo?: any) {
    try {
      const message = this.createShippingNotificationMessage(phoneNumber, orderData, trackingInfo);
      await this.sendMessage(message);
      
      this.logger.log(`Shipping notification sent to ${phoneNumber} for order ${orderData.orderId}`);
      return { success: true, message: 'Shipping notification sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send shipping notification: ${error.message}`);
      throw error;
    }
  }

  async sendDeliveryConfirmation(phoneNumber: string, orderData: any) {
    try {
      const message = this.createDeliveryConfirmationMessage(phoneNumber, orderData);
      await this.sendMessage(message);
      
      this.logger.log(`Delivery confirmation sent to ${phoneNumber} for order ${orderData.orderId}`);
      return { success: true, message: 'Delivery confirmation sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send delivery confirmation: ${error.message}`);
      throw error;
    }
  }

  async sendCustomMessage(phoneNumber: string, messageText: string) {
    try {
      const message: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: messageText }
      };

      await this.sendMessage(message);
      
      this.logger.log(`Custom message sent to ${phoneNumber}`);
      return { success: true, message: 'Custom message sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send custom message: ${error.message}`);
      throw error;
    }
  }

  private createOrderConfirmationMessage(phoneNumber: string, orderData: any): WhatsAppMessage {
    const itemsList = orderData.items.map((item: any) => 
      `• ${item.quantity}x ${item.product.name} - ₺${item.price}`
    ).join('\n');

    const messageText = `🎉 *Sipariş Onayı*

*Sipariş No:* ${orderData.orderId}
*Tarih:* ${new Date(orderData.createdAt).toLocaleDateString('tr-TR')}
*Toplam:* ₺${orderData.totalAmount}

*Sipariş Edilen Ürünler:*
${itemsList}

*Teslimat Adresi:*
${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}
${orderData.shippingAddress.addressLine1}
${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}

Siparişiniz başarıyla alındı ve hazırlanmaya başlandı. Sipariş durumu hakkında bilgilendirileceksiniz.

Teşekkürler! 🛍️`;

    return {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: messageText }
    };
  }

  private createOrderStatusUpdateMessage(phoneNumber: string, orderData: any, newStatus: string): WhatsAppMessage {
    const statusMessages = {
      'CONFIRMED': '✅ Siparişiniz onaylandı ve hazırlanmaya başlandı.',
      'PREPARING': '📦 Siparişiniz hazırlanıyor.',
      'SHIPPED': '🚚 Siparişiniz kargoya verildi.',
      'DELIVERED': '🎉 Siparişiniz teslim edildi!',
      'CANCELLED': '❌ Siparişiniz iptal edildi.'
    };

    const messageText = `📋 *Sipariş Durumu Güncellendi*

*Sipariş No:* ${orderData.orderId}
*Yeni Durum:* ${newStatus}
*Güncelleme Tarihi:* ${new Date().toLocaleDateString('tr-TR')}

${statusMessages[newStatus] || 'Sipariş durumunuz güncellendi.'}

Siparişinizle ilgili sorularınız için bizimle iletişime geçebilirsiniz.`;

    return {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: messageText }
    };
  }

  private createShippingNotificationMessage(phoneNumber: string, orderData: any, trackingInfo?: any): WhatsAppMessage {
    let messageText = `🚚 *Kargo Bildirimi*

*Sipariş No:* ${orderData.orderId}
*Kargo Tarihi:* ${new Date().toLocaleDateString('tr-TR')}

Siparişiniz kargoya verildi ve yola çıktı!`;

    if (trackingInfo) {
      messageText += `\n\n*Kargo Takip No:* ${trackingInfo.trackingNumber}
*Kargo Firması:* ${trackingInfo.carrier}`;
    }

    messageText += `\n\nKargo durumunuzu takip etmek için kargo firması ile iletişime geçebilirsiniz.`;

    return {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: messageText }
    };
  }

  private createDeliveryConfirmationMessage(phoneNumber: string, orderData: any): WhatsAppMessage {
    const messageText = `🎉 *Teslimat Onayı*

*Sipariş No:* ${orderData.orderId}
*Teslimat Tarihi:* ${new Date().toLocaleDateString('tr-TR')}

Siparişiniz başarıyla teslim edildi! 

Ürünlerimizi beğendiyseniz, yorum yaparak bizi destekleyebilirsiniz. 

Tekrar alışveriş yapmak için sitemizi ziyaret edebilirsiniz.

Teşekkürler! 🛍️`;

    return {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: messageText }
    };
  }

  private async sendMessage(message: WhatsAppMessage) {
    if (!this.phoneNumberId || !this.accessToken) {
      throw new Error('WhatsApp configuration is missing');
    }

    const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`WhatsApp API error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  }

  async validatePhoneNumber(phoneNumber: string): Promise<boolean> {
    // Basic phone number validation for Turkey
    const turkishPhoneRegex = /^(\+90|90|0)?[5][0-9]{9}$/;
    return turkishPhoneRegex.test(phoneNumber);
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If it starts with 0, remove it
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // If it doesn't start with 90, add it
    if (!cleaned.startsWith('90')) {
      cleaned = '90' + cleaned;
    }
    
    return cleaned;
  }
}
