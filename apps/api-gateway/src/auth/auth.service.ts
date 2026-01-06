import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthRegisterDto, AuthLoginDto } from 'src/dtos';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  registerAuthService(data: AuthRegisterDto) {
    return firstValueFrom(this.client.send('register', data));
  }

  loginAuthService(data: AuthLoginDto) {
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
