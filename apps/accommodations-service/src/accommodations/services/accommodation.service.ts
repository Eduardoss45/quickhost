import { RpcException } from '@nestjs/microservices';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccommodationRepository } from '../repositories/accommodation.repository';
import { Accommodation } from '../entities/accommodation.entity';
import { validate as isUUID } from 'uuid';
import { CreateCommentDto } from 'src/dtos/create.comment.dto';

@Injectable()
export class AccommodationService {
  private assertUUID(id: string, field: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`${field} must be a valid UUID`);
    }
  }

  constructor(
    private readonly accommodationRepository: AccommodationRepository,
  ) {}

  async create(data: Partial<Accommodation>) {
    const accommodation = this.accommodationRepository.create(data);
    return this.accommodationRepository.save(accommodation);
  }

  async findAll() {
    return this.accommodationRepository.find();
  }

  async findOne(id: string) {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
    });

    if (!accommodation) {
      throw new RpcException({
        statusCode: 404,
        message: 'Acomodação não encontrada',
      });
    }

    return accommodation;
  }

  async findByCreator(creatorId: string) {
    return this.accommodationRepository.findByCreatorId(creatorId);
  }

  async update(id: string, data: Partial<Accommodation>, userId: string) {
    const accommodation = await this.findOne(id);

    if (accommodation.creator_id !== userId) {
      throw new RpcException({
        statusCode: 403,
        message: 'Você não tem permissão para editar esta acomodação',
      });
    }

    Object.assign(accommodation, data);

    return this.accommodationRepository.save(accommodation);
  }

  async remove(id: string) {
    const accommodation = await this.findOne(id);
    await this.accommodationRepository.remove(accommodation);
  }

  async createComment(
    accommodationId: string,
    comment: CreateCommentDto & { authorId?: string; authorName?: string },
  ) {
    this.assertUUID(accommodationId, 'Task ID');

    const taskExists = await this.accommodationRepository.findOne({
      where: { id: accommodationId },
    });
    if (!taskExists) throw new NotFoundException('Task not found');

    const createdComment = await this.accommodationRepository.createComment({
      content: comment.content,
      authorId: comment.authorId!,
      authorName: comment.authorName!,
      accommodation: taskExists,
    });

    return createdComment;
  }

  async getComments(accommodationId: string, page?: number, size?: number) {
    this.assertUUID(accommodationId, 'Task ID');

    const task = await this.accommodationRepository.findOne({
      where: { id: accommodationId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const MAX_PAGE_SIZE = 10;

    const resolvedPage = page && page > 0 ? page : 1;
    const resolvedSize =
      size && size > 0 && size <= MAX_PAGE_SIZE ? size : MAX_PAGE_SIZE;

    return this.accommodationRepository.findComments(
      accommodationId,
      resolvedPage,
      resolvedSize,
    );
  }
}
