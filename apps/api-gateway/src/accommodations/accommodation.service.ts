import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateCommentCommand } from '../dtos';
import { CreateAccommodationCommand } from 'src/commands';
import { Accommodation } from 'src/types';

@Injectable()
export class AccommodationService {
  constructor(
    @Inject('ACCOMMODATIONS_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  findAllAccommodations() {
    return firstValueFrom(this.client.send('accommodation.find_all', {}));
  }

  findOneAccommodation(id: string) {
    return firstValueFrom(this.client.send('accommodation.find_one', id));
  }

  createAccommodation(data: CreateAccommodationCommand) {
    return firstValueFrom(this.client.send('accommodation.create', data));
  }

  updateAccommodation(
    id: string,
    data: Partial<Accommodation>,
    userId: string,
  ) {
    return firstValueFrom(
      this.client.send('accommodation.update', {
        id,
        data,
        creatorId: userId,
      }),
    );
  }

  removeAccommodation(id: string, userId: string) {
    return firstValueFrom(
      this.client.send('accommodation.remove', { id, userId }),
    );
  }

  findMyAccommodations(userId: string) {
    return firstValueFrom(
      this.client.send('accommodation.find_by_creator', {
        creatorId: userId,
      }),
    );
  }

  createCommentInAccommodation(command: CreateCommentCommand) {
    return firstValueFrom(
      this.client.send({ cmd: 'accommodation.create_comment' }, command),
    );
  }

  async getCommentsInAccommodation(id: string, page: number, size: number) {
    return firstValueFrom(
      this.client.send(
        { cmd: 'accommodation.get_comments' },
        { id, page, size },
      ),
    );
  }

  removeAccommodationImages(accommodationId: string, userId: string) {
    return firstValueFrom(
      this.client.send('accommodation.remove_images', {
        accommodationId,
        requesterId: userId,
      }),
    );
  }
}
