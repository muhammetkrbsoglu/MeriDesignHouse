import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { DatabaseModule } from '../database/database.module';
import { ClerkModule } from '../clerk/clerk.module';

@Module({
  imports: [DatabaseModule, ClerkModule],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
