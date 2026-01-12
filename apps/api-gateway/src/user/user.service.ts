import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto } from 'src/dtos';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  updateProfile(userId: string, dto: UpdateUserDto) {
    return firstValueFrom(
      this.client.send('user.update-profile', { userId, dto }),
    );
  }
}
