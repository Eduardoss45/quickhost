import { DataSource, Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { Accommodation } from '../entities/accommodation.entity';

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
