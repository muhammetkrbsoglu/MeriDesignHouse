import { Module } from '@nestjs/common';
import { ClerkModule } from './clerk.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [ClerkModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, ClerkModule],
})
export class AuthModule {}
