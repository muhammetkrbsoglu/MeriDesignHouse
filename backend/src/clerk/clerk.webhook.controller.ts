import { Controller, Post, HttpException, HttpStatus, Req, Headers } from '@nestjs/common';
import { ClerkWebhookService } from './clerk.webhook.service';
import { Request } from 'express';

@Controller('webhook/clerk')
export class ClerkWebhookController {
  constructor(private readonly clerkWebhookService: ClerkWebhookService) {}

  @Post()
  async handleWebhook(
    @Req() request: Request, 
    @Headers() headers: Record<string, string>,
  ) {
    try {
      // Access raw body from request object
      const rawBody = (request as any).rawBody;

      if (!rawBody) {
        throw new HttpException('Missing raw body', HttpStatus.BAD_REQUEST);
      }

      // Process the webhook
      const result = await this.clerkWebhookService.verifyAndProcessWebhook(
        rawBody,
        headers,
      );
      
      return { success: true, message: 'Webhook processed successfully', data: result };
    } catch (error) {
      // Handle HttpExceptions from service
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Handle other unexpected errors
      console.error('Webhook processing error:', error);
      throw new HttpException(
        'Webhook processing failed', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
