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
  async authLogout(@Payload() data: any) {
    return this.authService.logout(data);
  }

  @MessagePattern('refresh')
  async authRefresh(@Payload() data: any) {
    return this.authService.refresh(data);
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
