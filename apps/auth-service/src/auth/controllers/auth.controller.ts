import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('register')
  async authRegister(@Payload() data: any) {
    return this.authService.register(data);
  }

  @MessagePattern('login')
  async authLogin(@Payload() data: any) {
    return this.authService.login(data);
  }

  @MessagePattern('logout')
  async authLogout(@Payload() {}) {
    return 'logout';
  }

  @MessagePattern('refresh')
  async authRefresh(@Payload() {}) {
    return 'refresh';
  }

  @MessagePattern('forgot-password')
  async authForgotPassword(@Payload() {}) {
    return 'forgot-password';
  }

  @MessagePattern('reset-password')
  async authResetPassword(@Payload() {}) {
    return 'reset-password';
  }
}
