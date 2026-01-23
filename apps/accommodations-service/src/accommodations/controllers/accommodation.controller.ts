import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccommodationService } from '../services/accommodation.service';
import { Accommodation } from '../entities/accommodation.entity';
import { CreateCommentCommand } from 'src/dtos';

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
  async remove(@Payload() data: { id: string; userId: string }) {
    await this.accommodationService.remove(data.id, data.userId);
    return { success: true };
  }

  @MessagePattern('accommodation.find_by_creator')
  findByCreator(@Payload() data: { creatorId: string }) {
    return this.accommodationService.findByCreator(data.creatorId);
  }

  @MessagePattern({ cmd: 'accommodation.create_comment' })
  createComment(command: CreateCommentCommand) {
    return this.accommodationService.createComment(command);
  }

  @MessagePattern({ cmd: 'accommodation.get_comments' })
  getComments(data: { id: string; page: number; size: number }) {
    return this.accommodationService.getComments(data.id, data.page, data.size);
  }

  @MessagePattern('accommodation.update_next_available_date')
  updateNextAvailableDate(
    @Payload() data: { id: string; date: string | null },
  ) {
    return this.accommodationService.updateNextAvailableDate(
      data.id,
      data.date,
    );
  }
}
