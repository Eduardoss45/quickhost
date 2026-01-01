import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
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
