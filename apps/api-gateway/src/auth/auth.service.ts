import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto, LoginDto } from 'src/dtos';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  registerAuthService(data: RegisterDto) {
    return firstValueFrom(this.client.send('register', data));
  }

  loginAuthService(data: LoginDto) {
    return firstValueFrom(this.client.send('login', data));
  }

  logoutAuthService() {
    return firstValueFrom(this.client.send('logout', {}));
  }

  refreshAuthService() {
    return firstValueFrom(this.client.send('refresh', {}));
  }

  forgotPasswordAuthService() {
    return firstValueFrom(this.client.send('forgot-password', {}));
  }

  resetPasswordAuthService() {
    return firstValueFrom(this.client.send('reset-password', {}));
  }
}
