import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    Reflector,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}


