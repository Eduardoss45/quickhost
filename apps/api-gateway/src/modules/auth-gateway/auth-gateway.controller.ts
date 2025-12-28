import { Controller, Post, Body } from '@nestjs/common';
import { AuthGatewayService } from './auth-gateway.service';

@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly authGatewayService: AuthGatewayService) {}
  @Post('register')
  registerAuthController() {
    return this.authGatewayService.registerAuthService();
  }

  @Post('login')
  loginAuthController() {
    return this.authGatewayService.loginAuthService();
  }

  @Post('logout')
  logoutAuthController() {
    return this.authGatewayService.logoutAuthService();
  }

  @Post('refresh')
  refreshAuthController() {
    return this.authGatewayService.refreshAuthService();
  }

  @Post('forgot-password')
  forgotPasswordAuthController() {
    return this.authGatewayService.forgotPasswordAuthService();
  }

  @Post('reset-password')
  resetPasswordAuthController() {
    return this.authGatewayService.resetPasswordAuthService();
  }
}
