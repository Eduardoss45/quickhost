import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { BookingController } from './controllers/booking.controller';
import { BookingService } from './services/booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Booking } from './entities/booking.entity';
import { BookingRepository } from './repositories/booking.repository';
import { BookingCleanupJob } from './jobs/booking-cleanup.job';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Booking]),
    ClientsModule.registerAsync([
      {
        name: 'ACCOMMODATIONS_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('RMQ_URL')!],
            queue: 'qk_accommodations_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
      {
        name: 'NOTIFICATIONS_EVENTS',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RMQ_URL!],
            queue: 'qk_notifications_events_queue',
          },
        }),
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository, BookingCleanupJob],
})
export class BookingModule {}
