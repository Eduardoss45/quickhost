import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFavorite } from '../entities/user-favorite.entity';

@Injectable()
export class FavoritesRepository {
  constructor(
    @InjectRepository(UserFavorite)
    private readonly repo: Repository<UserFavorite>,
  ) {}

  exists(userId: string, accommodationId: string): Promise<boolean> {
    return this.repo.exists({
      where: {
        user_id: userId,
        accommodation_id: accommodationId,
      },
    });
  }

  async add(userId: string, accommodationId: string): Promise<void> {
    return this.repo
      .insert({
        user_id: userId,
        accommodation_id: accommodationId,
      })
      .then(() => undefined);
  }

  async remove(userId: string, accommodationId: string): Promise<void> {
    return this.repo
      .delete({
        user_id: userId,
        accommodation_id: accommodationId,
      })
      .then(() => undefined);
  }

  listByUser(userId: string): Promise<UserFavorite[]> {
    return this.repo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }
}
