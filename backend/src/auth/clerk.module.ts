import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClerkService } from './clerk.service';
import { ClerkGuard } from './clerk.guard';

@Module({
  imports: [ConfigModule],
  providers: [ClerkService, ClerkGuard],
  exports: [ClerkService, ClerkGuard],
})
export class ClerkModule {}
