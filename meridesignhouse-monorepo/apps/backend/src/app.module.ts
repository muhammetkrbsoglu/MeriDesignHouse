import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AuthModule, UserModule, CategoryModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
