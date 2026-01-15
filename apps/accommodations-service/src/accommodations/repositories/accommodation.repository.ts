import { Repository } from 'typeorm';
import { Accommodation } from '../entities/accommodation.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AccommodationRepository extends Repository<Accommodation> {
  constructor(dataSource: DataSource) {
    super(Accommodation, dataSource.createEntityManager());
  }

  findByCreatorId(creatorId: string) {
    return this.find({
      where: { creator_id: creatorId },
      order: { created_at: 'DESC' },
    });
  }
}
