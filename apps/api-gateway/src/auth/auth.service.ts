import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthLoginDto } from 'src/dtos'; // ! remover depois de criar o comando
import { firstValueFrom } from 'rxjs';
import { RegisterCommand } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  registerAuthService(command: RegisterCommand) {
    return firstValueFrom(this.client.send('register', command));
  }

  loginAuthService(command: AuthLoginDto) {
    return firstValueFrom(this.client.send('login', command));
  }

  logoutAuthService(data: { refreshToken: string }) {
    return firstValueFrom(this.client.send('logout', data));
  }

  refreshAuthService(data: { refreshToken: string }) {
    return firstValueFrom(this.client.send('refresh', data));
  }

  forgotPasswordAuthService() {
    return firstValueFrom(this.client.send('forgot-password', {}));
  }

  resetPasswordAuthService() {
    return firstValueFrom(this.client.send('reset-password', {}));
  }
}
