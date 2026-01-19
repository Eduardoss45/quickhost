import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Comment } from '../entities/comment.entity';
import { Accommodation } from '../entities/accommodation.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
    private readonly dataSource: DataSource,
  ) {}

  async createCommentWithRatingUpdate(data: {
    content: string;
    rating: number;
    authorId: string;
    authorName: string;
    accommodationId: string;
  }) {
    return this.dataSource.transaction(async (manager) => {
      const commentRepo = manager.getRepository(Comment);
      const accommodationRepo = manager.getRepository(Accommodation);

      const accommodation = await accommodationRepo.findOne({
        where: { id: data.accommodationId },
      });

      if (!accommodation) return null;

      const createdComment = commentRepo.create({
        content: data.content,
        rating: data.rating,
        authorId: data.authorId,
        authorName: data.authorName,
        accommodation,
      });

      await commentRepo.save(createdComment);

      const { avg } = (await commentRepo
        .createQueryBuilder('comment')
        .select('AVG(comment.rating)', 'avg')
        .where('comment.accommodationId = :id', {
          id: accommodation.id,
        })
        .getRawOne<{ avg: string }>()) ?? { avg: '0' };

      accommodation.average_rating = Number(Number(avg ?? 0).toFixed(2));

      await accommodationRepo.save(accommodation);

      return createdComment;
    });
  }

  findByAccommodation(accommodationId: string) {
    return this.repo.find({
      where: { accommodation: { id: accommodationId } },
      order: { createdAt: 'DESC' },
    });
  }

  findComments(accommodationId: string, page: number, size: number) {
    return this.repo.find({
      where: { accommodation: { id: accommodationId } },
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });
  }
}
