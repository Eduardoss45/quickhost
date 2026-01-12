import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AccommodationModule } from './accommodations/accommodations.module';
import { SecurityModule } from 'strategies/security.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 10,
      },
    ]),
    AuthModule,
    UserModule,
    SecurityModule,
    AccommodationModule,
  ],
})
export class ApiGatewayModule {}
