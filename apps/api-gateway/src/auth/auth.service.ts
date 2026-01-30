import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthLoginDto } from 'src/dtos';
import { firstValueFrom } from 'rxjs';
import { RegisterCommand } from 'src/types';

@Injectable()
export class AuthService {
  private normalizeBirthDate(input: string | Date): Date {
    if (input instanceof Date && !isNaN(input.getTime())) {
      return input;
    }

    if (typeof input === 'string') {
      const dateOnly = input.includes('T') ? input.split('T')[0] : input;

      const date = new Date(`${dateOnly}T00:00:00.000Z`);

      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    throw new Error('Invalid birth_date format');
  }

  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  registerAuthService(command: RegisterCommand) {
    command.birth_date = this.normalizeBirthDate(command.birth_date);

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

  forgotPasswordAuthService(email: string) {
    return firstValueFrom(this.client.send('forgot-password', { email }));
  }

  resetPasswordAuthService(data: {
    token: string;
    password: string;
    confirm_password: string;
  }) {
    return firstValueFrom(this.client.send('reset-password', data));
  }
}
