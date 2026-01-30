import { ClientProxy, RpcException } from '@nestjs/microservices';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AccommodationRepository } from '../repositories/accommodation.repository';
import { Accommodation } from '../entities/accommodation.entity';
import { validate as isUUID } from 'uuid';
import { CommentRepository } from '../repositories/comments.repository';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AccommodationService {
  private assertUUID(id: string, field: string) {
    if (!isUUID(id)) {
      throw new BadRequestException(`${field} must be a valid UUID`);
    }
  }

  private hasRawImages(data: Partial<Accommodation>): boolean {
    const hasCover = Boolean(
      data.main_cover_image && data.main_cover_image.includes('/raw/'),
    );

    const hasInternal = Boolean(
      data.internal_images &&
      data.internal_images.some((img) => img.includes('/raw/')),
    );

    return hasCover || hasInternal;
  }

  private async processImagesIfNeeded(
    accommodationId: string,
    data: Partial<Accommodation>,
  ) {
    if (!this.hasRawImages(data)) return data;

    try {
      const result = await firstValueFrom(
        this.mediaClient.send('process_accommodation_images', {
          accommodationId,
        }),
      );

      return {
        ...data,
        main_cover_image: result.cover,
        internal_images: result.images,
      };
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Erro ao processar imagens da acomodação',
      });
    }
  }

  constructor(
    private readonly accommodationRepository: AccommodationRepository,
    private readonly commentRepository: CommentRepository,
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
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

  async update(payload: {
    id: string;
    data: Partial<Accommodation>;
    creatorId: string;
  }) {
    const accommodation = await this.findOne(payload.id);

    if (accommodation.creator_id !== payload.creatorId) {
      throw new RpcException({
        statusCode: 403,
        message: 'Você não tem permissão para editar esta acomodação',
      });
    }

    const processedData = await this.processImagesIfNeeded(
      payload.id,
      payload.data,
    );

    Object.assign(accommodation, processedData);

    return this.accommodationRepository.save(accommodation);
  }

  async remove(id: string, userId: string) {
    const accommodation = await this.findOne(id);

    if (accommodation.creator_id !== userId) {
      throw new RpcException({
        statusCode: 403,
        message: 'Você não tem permissão para deletar esta acomodação',
      });
    }

    await this.accommodationRepository.remove(accommodation);

    return { success: true };
  }

  async createComment(comment: {
    content: string;
    rating: number;
    authorId: string;
    authorName: string;
    accommodationId: string;
  }) {
    this.assertUUID(comment.accommodationId, 'Accommodation ID');

    const accommodation = await this.findOne(comment.accommodationId);

    if (accommodation.creator_id === comment.authorId) {
      throw new RpcException({
        statusCode: 403,
        message: 'Você não pode comentar em sua própria acomodação',
      });
    }

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

  async updateNextAvailableDate(accommodationId: string, date: string | null) {
    const accommodation = await this.findOne(accommodationId);

    accommodation.next_available_date = date;
    accommodation.is_active = date === null;

    return this.accommodationRepository.save(accommodation);
  }

  async removeImages(id: string, userId: string) {
    const accommodation = await this.findOne(id);

    if (accommodation.creator_id !== userId) {
      throw new RpcException({
        statusCode: 403,
        message:
          'Você não tem permissão para remover as imagens desta acomodação',
      });
    }

    try {
      await firstValueFrom(
        this.mediaClient.send('remove-accommodation-images', {
          accommodationId: id,
        }),
      );

      accommodation.main_cover_image = '';
      accommodation.internal_images = [];

      return this.accommodationRepository.save(accommodation);
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Erro ao remover imagens da acomodação',
      });
    }
  }
}
