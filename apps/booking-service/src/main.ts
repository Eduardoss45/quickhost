import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BookingModule } from './booking/booking.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookingModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL!],
        queue: 'qk_booking_queue',
        queueOptions: {
          durable: true,
        },
        noAck: false,
        prefetchCount: 1,
      },
    },
  );

  await app.listen();
}
bootstrap();
