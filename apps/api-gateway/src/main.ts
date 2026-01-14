import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { SocketIoAdapter } from './socket-io/socket-io.adapter';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { resolve } from 'path';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: [process.env.FRONTEND_URL], credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cookieParser());
  app.useWebSocketAdapter(new SocketIoAdapter(app, process.env.FRONTEND_URL!));
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL!],
      queue: 'qk_chat_gateway_queue',
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();

  const uploadsDir = resolve(__dirname, '..', '..', '..', '..', 'uploads');

  app.use(
    '/uploads',
    express.static(uploadsDir, {
      maxAge: '30d',
      immutable: true,
    }),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
