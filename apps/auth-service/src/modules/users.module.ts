import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { UserService } from './user/services/user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user/controllers/user.controller';
import { FavoritesReconciliationJob } from '../job/favorites.reconciliation.job';
import { UserFavorite } from './entities/user-favorite.entity';
import { FavoritesRepository } from './repositories/favorites.repository';

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
    TypeOrmModule.forFeature([User, UserFavorite]),
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
      {
        name: 'AUTH_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('RMQ_URL')!],
            queue: 'qk_auth_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
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
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    FavoritesRepository,
    FavoritesReconciliationJob,
  ],
  exports: [],
})
export class UserModule {}
