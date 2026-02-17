import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { SocketIoAdapter } from './socket-io/socket-io.adapter';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { resolve } from 'path';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function getUploadsPath() {
  const root = process.env.PROJECT_ROOT;
  if (!root) {
    throw new Error('PROJECT_ROOT environment variable is not defined');
  }
  return resolve(root, 'uploads');
}

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.setGlobalPrefix('api');

  const frontendOrigins = process.env
    .FRONTEND_URL!.split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: frontendOrigins,
    credentials: true,
  });

  app.useWebSocketAdapter(new SocketIoAdapter(app, frontendOrigins));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL!],
      queue: 'qk_chat_gateway_queue',
      queueOptions: { durable: true },
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL!],
      queue: 'qk_gateway_notifications_queue',
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();

  const uploadsDir = getUploadsPath();

  app.use(
    '/uploads',
    express.static(uploadsDir, {
      setHeaders(res) {
        res.setHeader('Cache-Control', 'public, max-age=60, must-revalidate');
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Quickhost API')
    .setDescription('API para sistemas de hospedagem')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('refreshToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
