import { Module } from '@nestjs/common';
import { ClerkWebhookController } from './clerk.webhook.controller';
import { ClerkWebhookService } from './clerk.webhook.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ClerkWebhookController],
  providers: [ClerkWebhookService],
  exports: [ClerkWebhookService],
})
export class ClerkWebhookModule {}
