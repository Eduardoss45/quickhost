import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'BOOKING_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('RMQ_URL')!],
            queue: 'qk_booking_queue',
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
