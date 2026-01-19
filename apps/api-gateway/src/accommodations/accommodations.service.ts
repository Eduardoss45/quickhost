import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateCommentDto } from 'src/dtos/create.comment.dto';

@Injectable()
export class AccommodationsService {
  constructor(
    @Inject('ACCOMMODATIONS_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  findAll() {
    return firstValueFrom(this.client.send('accommodation.find_all', {}));
  }

  findOne(id: string) {
    return firstValueFrom(this.client.send('accommodation.find_one', id));
  }

  create(data: any) {
    return firstValueFrom(this.client.send('accommodation.create', data));
  }

  update(id: string, data: any, userId: string) {
    return firstValueFrom(
      this.client.send('accommodation.update', {
        id,
        data,
        creatorId: userId,
      }),
    );
  }

  remove(id: string) {
    return firstValueFrom(this.client.send('accommodation.remove', id));
  }

  findMyAccommodations(userId: string) {
    return firstValueFrom(
      this.client.send('accommodation.find_by_creator', {
        creatorId: userId,
      }),
    );
  }

  async createComment(taskId: string, comment: CreateCommentDto) {
    return firstValueFrom(
      this.client.send({ cmd: 'createComment' }, { taskId, comment }),
    );
  }

  async getComments(taskId: string, page: number, size: number) {
    return firstValueFrom(
      this.client.send({ cmd: 'getComments' }, { taskId, page, size }),
    );
  }
}
