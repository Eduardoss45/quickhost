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

  async updateProfile(userId: string, dto: UpdateUserDto) {
    return await firstValueFrom(
      this.client.send('update-profile', {
        userId,
        dto,
      }),
    );
  }

  async getProfile(userId: string) {
    return await firstValueFrom(
      this.client.send('get-profile', {
        userId,
      }),
    );
  }

  async removeProfilePicture(userId: string) {
    return await firstValueFrom(
      this.client.send('remove-profile-picture', { userId }),
    );
  }

  getPublicUser(userId: string) {
    return firstValueFrom(
      this.client.send('user.get_public_profile', { userId }),
    );
  }

  add(userId: string, accommodationId: string) {
    return firstValueFrom(
      this.client.send('favorites.add', {
        userId,
        accommodationId,
      }),
    );
  }

  remove(userId: string, accommodationId: string) {
    return firstValueFrom(
      this.client.send('favorites.remove', {
        userId,
        accommodationId,
      }),
    );
  }

  async listByUser(userId: string) {
    return firstValueFrom(
      this.client.send('favorites.list_by_user', { userId }),
    );
  }
}
