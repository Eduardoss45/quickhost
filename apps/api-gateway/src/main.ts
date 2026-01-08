import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: [process.env.FRONTEND_URL], credentials: true });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
