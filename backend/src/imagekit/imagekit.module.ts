import { Module } from '@nestjs/common';
import { ImageKitController } from './imagekit.controller';
import { ImageKitService } from './imagekit.service';
import { ClerkModule } from '../auth/clerk.module';

@Module({
  imports: [ClerkModule],
  controllers: [ImageKitController],
  providers: [ImageKitService],
  exports: [ImageKitService],
})
export class ImageKitModule {}
