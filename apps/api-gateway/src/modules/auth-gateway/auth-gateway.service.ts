import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGatewayService {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  registerAuthService() {
    return firstValueFrom(this.client.send('auth-register', {}));
  }

  loginAuthService() {
    return firstValueFrom(this.client.send('auth-login', {}));
  }

  logoutAuthService() {
    return firstValueFrom(this.client.send('auth-logout', {}));
  }

  refreshAuthService() {
    return firstValueFrom(this.client.send('auth-refresh', {}));
  }

  forgotPasswordAuthService() {
    return firstValueFrom(this.client.send('auth-forgot-password', {}));
  }

  resetPasswordAuthService() {
    return firstValueFrom(this.client.send('auth-reset-password', {}));
  }
}
