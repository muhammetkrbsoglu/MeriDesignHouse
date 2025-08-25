import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseModule } from '../database/database.module';
import { ClerkModule } from '../auth/clerk.module';
import { ImageKitModule } from '../imagekit/imagekit.module';

@Module({
  imports: [DatabaseModule, ClerkModule, ImageKitModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
