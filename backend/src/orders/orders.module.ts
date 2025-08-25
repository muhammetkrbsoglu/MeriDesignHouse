import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DatabaseModule } from '../database/database.module';
import { ClerkModule } from '../clerk/clerk.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [DatabaseModule, ClerkModule, WhatsAppModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
