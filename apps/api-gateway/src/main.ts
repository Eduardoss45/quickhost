import { NestFactory } from '@nestjs/core';
import { AuthGatewayModule } from './modules/auth-gateway/auth-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthGatewayModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
