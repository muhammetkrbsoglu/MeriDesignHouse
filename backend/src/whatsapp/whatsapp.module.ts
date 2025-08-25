import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';
import { ConfigModule } from '@nestjs/config';
import { ClerkModule } from '../clerk/clerk.module';

@Module({
  imports: [ConfigModule, ClerkModule],
  controllers: [WhatsAppController],
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
