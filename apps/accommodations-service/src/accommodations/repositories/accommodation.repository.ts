import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accommodation } from '../entities/accommodation.entity';
import { Comment } from '../entities/comment.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AccommodationRepository extends Repository<Accommodation> {
  @InjectRepository(Comment)
  private commentsRepo: Repository<Comment>;

  constructor(dataSource: DataSource) {
    super(Accommodation, dataSource.createEntityManager());
  }

  findByCreatorId(creatorId: string) {
    return this.find({
      where: { creator_id: creatorId },
      order: { created_at: 'DESC' },
    });
  }

  createComment(comment: Partial<Comment>) {
    return this.commentsRepo.save(this.commentsRepo.create(comment));
  }

  findComments(accommodationId: string, page: number, size: number) {
    return this.commentsRepo.find({
      where: { accommodation: { id: accommodationId } },
      skip: (page - 1) * size,
      take: size,
    });
  }
}
