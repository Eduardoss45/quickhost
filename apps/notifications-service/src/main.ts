import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications/notifications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationsModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL!],
        queue: 'qk_notifications_queue',
        queueOptions: { durable: true },
      },
    },
  );

  await app.listen();
}
bootstrap();