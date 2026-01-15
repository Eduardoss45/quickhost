import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccommodationController } from './controllers/accommodation.controller';
import { AccommodationService } from './services/accommodation.service';
import { Accommodation } from './entities/accommodation.entity';
import { AccommodationRepository } from './repositories/accommodation.repository';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([Accommodation]),
    ClientsModule.registerAsync([
      {
        name: 'MEDIA_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get('RMQ_URL')],
            queue: 'qk_media_queue',
            queueOptions: { durable: false },
          },
        }),
      },
    ]),
  ],
  controllers: [AccommodationController],
  providers: [AccommodationService, AccommodationRepository],
})
export class AccommodationModule {}
