import { Module } from '@nestjs/common';
import { AccommodationController } from './accommodation.controller';
import { AccommodationService } from './accommodation.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { LocalImageStorageService } from '../storage/local-image-storage.service';

@Module({
  imports: [
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
    ]),
  ],
  controllers: [AccommodationController],
  providers: [AccommodationService, LocalImageStorageService],
})
export class AccommodationModule {}
