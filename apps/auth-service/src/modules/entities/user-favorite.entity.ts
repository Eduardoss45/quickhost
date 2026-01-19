import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Index(['user_id', 'accommodation_id'], { unique: true })
@Entity('user_favorites')
export class UserFavorite {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user_id!: string;

  @Column('uuid')
  accommodation_id!: string;

  @CreateDateColumn()
  created_at!: Date;
}
