import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { PrismaModule } from '../database/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ClerkModule } from '../clerk/clerk.module';

@Module({
  imports: [PrismaModule, AuthModule, ClerkModule],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService]
})
export class AddressesModule {}
