import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { DatabaseModule } from '../database/database.module';
import { ClerkModule } from '../auth/clerk.module';

@Module({
  imports: [DatabaseModule, ClerkModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoriesModule {}
