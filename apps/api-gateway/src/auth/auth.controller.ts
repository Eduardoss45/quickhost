import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto, AuthLoginDto } from '../dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  registerAuthController(@Body() data: AuthRegisterDto) {
    return this.authService.registerAuthService(data);
  }

  @Post('login')
  loginAuthController(@Body() data: AuthLoginDto) {
    return this.authService.loginAuthService(data);
  }

  @Post('logout')
  logoutAuthController() {
    return this.authService.logoutAuthService();
  }

  @Post('refresh')
  refreshAuthController() {
    return this.authService.refreshAuthService();
  }

  @Post('forgot-password')
  forgotPasswordAuthController() {
    return this.authService.forgotPasswordAuthService();
  }

  @Post('reset-password')
  resetPasswordAuthController() {
    return this.authService.resetPasswordAuthService();
  }
}
