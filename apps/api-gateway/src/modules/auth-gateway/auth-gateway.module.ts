import { Module } from '@nestjs/common';
import { AuthGatewayController } from './auth-gateway.controller';
import { AuthGatewayService } from './auth-gateway.service';

@Module({
  controllers: [AuthGatewayController],
  providers: [AuthGatewayService],
  exports: [],
})
export class AuthGatewayModule {}
