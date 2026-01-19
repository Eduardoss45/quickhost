import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

@Module({
  imports: [AuthModule, UserModule],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL!],
        queue: 'qk_auth_queue',
        prefetchCount: 10,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
