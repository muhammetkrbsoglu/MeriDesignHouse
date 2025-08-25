import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma/prisma.service';
import { Webhook } from 'svix';
import { HttpException, HttpStatus } from '@nestjs/common';

interface WebhookEvent {
  type: string;
  data: any;
  object: string;
}

@Injectable()
export class ClerkWebhookService {
  private readonly logger = new Logger(ClerkWebhookService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  // Manuel doğrulama kodunu svix kütüphanesi ile değiştiriyoruz.
  // Bu fonksiyon artık hem doğrulamayı yapacak hem de doğrulanmış event'i döndürecek.
  async verifyAndProcessWebhook(
    rawBody: Buffer,
    headers: Record<string, string | string[] | undefined>,
  ): Promise<any> {
    const webhookSecret = this.configService.get<string>('CLERK_WEBHOOK_SECRET');

    if (!webhookSecret) {
      this.logger.error('CLERK_WEBHOOK_SECRET not configured');
      throw new HttpException('Webhook secret not configured', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const wh = new Webhook(webhookSecret);

    let event: WebhookEvent;

    try {
      // wh.verify metodu imza, timestamp gibi tüm kontrolleri yapar.
      // Başarılı olursa, JSON'u parse edip event nesnesini döner.
      // Başarısız olursa hata fırlatır.
      event = wh.verify(rawBody.toString('utf8'), headers as Record<string, string>) as WebhookEvent;
    } catch (err) {
      this.logger.error('Webhook signature verification failed:', err.message);
      throw new HttpException('Invalid webhook signature', HttpStatus.UNAUTHORIZED);
    }
    
    this.logger.log(`Webhook event verified successfully: ${event.type}`);
    
    // Doğrulama başarılıysa, event'i işlemeye devam et.
    return this.processWebhookEvent(event);
  }

  private async processWebhookEvent(payload: WebhookEvent): Promise<any> {
    try {
      this.logger.log(`Processing webhook event: ${payload.type}`);

      switch (payload.type) {
        case 'user.created':
          return await this.handleUserCreated(payload.data);
        
        case 'user.updated':
          return await this.handleUserUpdated(payload.data);
        
        case 'user.deleted':
          return await this.handleUserDeleted(payload.data);
        
        default:
          this.logger.log(`Unhandled webhook event type: ${payload.type}`);
          return { status: 'ignored', type: payload.type };
      }
    } catch (error) {
      this.logger.error('Error processing webhook event:', error);
      // Hata oluşursa yeniden fırlat ki controller yakalasın.
      throw error;
    }
  }

  private async handleUserCreated(userData: any): Promise<any> {
    try {
      const { id, email_addresses, first_name, last_name, phone_numbers } = userData;

      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (existingUser) {
        this.logger.log(`User ${id} already exists in database`);
        return { status: 'user_already_exists', userId: id };
      }

      const newUser = await this.prisma.user.create({
        data: {
          id,
          email: email_addresses?.[0]?.email_address || '',
          firstName: first_name || '',
          lastName: last_name || '',
          phoneNumber: phone_numbers?.[0]?.phone_number || null,
        },
      });

      this.logger.log(`User ${id} created successfully`);
      return { status: 'user_created', userId: id, user: newUser };
    } catch (error) {
      this.logger.error('Error creating user:', error);
      throw error;
    }
  }

  private async handleUserUpdated(userData: any): Promise<any> {
    try {
      const { id, email_addresses, first_name, last_name, phone_numbers } = userData;

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          email: email_addresses?.[0]?.email_address || '',
          firstName: first_name || '',
          lastName: last_name || '',
          phoneNumber: phone_numbers?.[0]?.phone_number || null,
        },
      });

      this.logger.log(`User ${id} updated successfully`);
      return { status: 'user_updated', userId: id, user: updatedUser };
    } catch (error) {
      this.logger.error('Error updating user:', error);
      throw error;
    }
  }

  private async handleUserDeleted(userData: any): Promise<any> {
    try {
      const { id } = userData;

      // Önce kullanıcıyı bul
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        this.logger.warn(`User with id ${id} not found for deletion.`);
        return { status: 'user_not_found', userId: id };
      }

      await this.prisma.user.delete({
        where: { id },
      });

      this.logger.log(`User ${id} deleted successfully`);
      return { status: 'user_deleted', userId: id };
    } catch (error) {
      // Prisma'nın P2025 hatası, silinecek kayıt bulunamadığında ortaya çıkar.
      if (error.code === 'P2025') {
        this.logger.warn(`Attempted to delete user ${userData.id} but they were not found in the database.`);
        return { status: 'user_not_found', userId: userData.id };
      }
      this.logger.error('Error deleting user:', error);
      throw error;
    }
  }
}