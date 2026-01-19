import { RpcException } from '@nestjs/microservices';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AccommodationRepository } from '../repositories/accommodation.repository';
import { Accommodation } from '../entities/accommodation.entity';
import { Comment } from '../entities/comment.entity';
import { validate as isUUID } from 'uuid';
import { CommentRepository } from '../repositories/comments.repository';

@Injectable()
export class AccommodationService {
  private assertUUID(id: string, field: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`${field} must be a valid UUID`);
    }
  }

  constructor(
    private readonly accommodationRepository: AccommodationRepository,
    private readonly commentRepository: CommentRepository,
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

  async createComment(comment: {
    content: string;
    rating: number;
    authorId: string;
    authorName: string;
    accommodationId: string;
  }) {
    this.assertUUID(comment.accommodationId, 'Accommodation ID');

    console.log(comment.rating); // ! valor 5

    const created =
      await this.commentRepository.createCommentWithRatingUpdate(comment);

    if (!created) {
      throw new RpcException({
        statusCode: 404,
        message: 'Acomodação não encontrada',
      });
    }

    return created;
  }

  async getComments(accommodationId: string, page?: number, size?: number) {
    this.assertUUID(accommodationId, 'Accommodation ID');

    const accommodation = await this.findOne(accommodationId);

    const MAX_PAGE_SIZE = 10;

    const resolvedPage = page && page > 0 ? page : 1;
    const resolvedSize =
      size && size > 0 && size <= MAX_PAGE_SIZE ? size : MAX_PAGE_SIZE;

    return this.commentRepository.findComments(
      accommodation.id,
      resolvedPage,
      resolvedSize,
    );
  }
}
