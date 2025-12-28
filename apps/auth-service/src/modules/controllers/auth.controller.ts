import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  @MessagePattern('auth-register')
  async authRegister(@Payload() {}) {
    return 'auth-register';
  }

  @MessagePattern('auth-login')
  async authLogin(@Payload() {}) {
    return 'auth-login';
  }

  @MessagePattern('auth-logout')
  async authLogout(@Payload() {}) {
    return 'auth-logout';
  }

  @MessagePattern('auth-refresh')
  async authRefresh(@Payload() {}) {
    return 'auth-refresh';
  }

  @MessagePattern('auth-forgot-password')
  async authForgotPassword(@Payload() {}) {
    return 'auth-forgot-password';
  }

  @MessagePattern('auth-reset-password')
  async authResetPassword(@Payload() {}) {
    return 'auth-reset-password';
  }
}
