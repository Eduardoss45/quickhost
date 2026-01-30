import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccommodationService } from '../services/accommodation.service';
import { Accommodation } from '../entities/accommodation.entity';

@Controller()
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

  @MessagePattern('accommodation.create')
  create(@Payload() payload: Partial<Accommodation>): Promise<Accommodation> {
    return this.accommodationService.create(payload);
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
    return this.accommodationService.update(payload);
  }

  @MessagePattern('accommodation.remove')
  async remove(@Payload() payload: { id: string; userId: string }) {
    await this.accommodationService.remove(payload.id, payload.userId);
    return { success: true };
  }

  @MessagePattern('accommodation.find_by_creator')
  findByCreator(@Payload() payload: { creatorId: string }) {
    return this.accommodationService.findByCreator(payload.creatorId);
  }

  @MessagePattern({ cmd: 'accommodation.create_comment' })
  createComment(payload: {
    content: string;
    rating: number;
    accommodationId: string;
    authorId: string;
    authorName: string;
  }) {
    return this.accommodationService.createComment(payload);
  }

  @MessagePattern({ cmd: 'accommodation.get_comments' })
  getComments(payload: { id: string; page: number; size: number }) {
    return this.accommodationService.getComments(
      payload.id,
      payload.page,
      payload.size,
    );
  }

  @MessagePattern('accommodation.update_next_available_date')
  updateNextAvailableDate(
    @Payload() payload: { id: string; date: string | null },
  ) {
    return this.accommodationService.updateNextAvailableDate(
      payload.id,
      payload.date,
    );
  }

  @MessagePattern('accommodation.remove_images')
  async removeImages(
    @Payload()
    payload: {
      accommodationId: string;
      requesterId: string;
    },
  ) {
    return this.accommodationService.removeImages(
      payload.accommodationId,
      payload.requesterId,
    );
  }
}
