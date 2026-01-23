import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFavorite } from '../modules/entities/user-favorite.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FavoritesReconciliationJob {
  constructor(
    @InjectRepository(UserFavorite)
    private readonly favoritesRepo: Repository<UserFavorite>,
    @Inject('ACCOMMODATIONS_CLIENT')
    private readonly client: ClientProxy,
  ) {}
  @Cron('0 3 * * *')
  async run() {
    const ids = await this.favoritesRepo
      .createQueryBuilder('f')
      .select('DISTINCT f.accommodation_id', 'id')
      .getRawMany<{ id: string }>();

    const existingIds = await lastValueFrom(
      this.client.send<string[]>(
        'accommodation.find_one',
        ids.map((i) => i.id),
      ),
    );

    const missing = ids
      .map((i) => i.id)
      .filter((id) => !existingIds.includes(id));

    if (missing.length) {
      await this.favoritesRepo
        .createQueryBuilder()
        .delete()
        .where('accommodation_id IN (:...ids)', { ids: missing })
        .execute();
    }
  }
}
