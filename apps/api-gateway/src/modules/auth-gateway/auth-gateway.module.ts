import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthGatewayController } from './auth-gateway.controller';
import { AuthGatewayService } from './auth-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL!],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AuthGatewayController],
  providers: [AuthGatewayService],
  exports: [],
})
export class AuthGatewayModule {}
