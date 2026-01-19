import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccommodationController } from './controllers/accommodation.controller';
import { AccommodationService } from './services/accommodation.service';
import { Accommodation } from './entities/accommodation.entity';
import { AccommodationRepository } from './repositories/accommodation.repository';
import { Comment } from './entities/comment.entity';

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
    TypeOrmModule.forFeature([Accommodation, Comment]),
  ],
  controllers: [AccommodationController],
  providers: [AccommodationService, AccommodationRepository],
})
export class AccommodationModule {}
