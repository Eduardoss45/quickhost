import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AccommodationModule } from './accommodations/accommodations.module';
import { ChatModule } from './chat/chat.module';
import { SecurityModule } from './strategies/security.module';
import { RmqExceptionInterceptor } from './exception/rmq-exception.interceptor';
import { BookingModule } from './booking/booking.module';

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
    ChatModule,
    BookingModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RmqExceptionInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ApiGatewayModule {}
