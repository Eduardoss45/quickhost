import { CreateCommentDto } from '../../dtos/create.comment.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccommodationService } from '../services/accommodation.service';
import { Accommodation } from '../entities/accommodation.entity';

@Controller()
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

  @MessagePattern('accommodation.create')
  create(@Payload() data: Partial<Accommodation>): Promise<Accommodation> {
    return this.accommodationService.create(data);
  }

  @MessagePattern('accommodation.find_all')
  findAll(): Promise<Accommodation[]> {
    return this.accommodationService.findAll();
  }

  @MessagePattern('accommodation.find_one')
  findOne(@Payload() id: string): Promise<Accommodation> {
    return this.accommodationService.findOne(id);
  }

  @MessagePattern('accommodation.update')
  async update(
    @Payload()
    payload: {
      id: string;
      data: Partial<Accommodation>;
      creatorId: string;
    },
  ) {
    return this.accommodationService.update(
      payload.id,
      payload.data,
      payload.creatorId,
    );
  }

  @MessagePattern('accommodation.remove')
  remove(@Payload() id: string): Promise<void> {
    return this.accommodationService.remove(id);
  }

  @MessagePattern('accommodation.find_by_creator')
  findByCreator(@Payload() data: { creatorId: string }) {
    return this.accommodationService.findByCreator(data.creatorId);
  }

  @MessagePattern({ cmd: 'createComment' })
  createComment(data: {
    taskId: string;
    authorName: string;
    comment: CreateCommentDto;
  }) {
    return this.accommodationService.createComment(data.taskId, data.comment);
  }

  @MessagePattern({ cmd: 'getComments' })
  getComments(data: { taskId: string; page: number; size: number }) {
    return this.accommodationService.getComments(
      data.taskId,
      data.page,
      data.size,
    );
  }
}
