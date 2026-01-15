import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category, SpaceType } from '../enums';

@Entity('accommodations')
export class Accommodation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid' })
  creator_id: string;

  @Column({ nullable: true })
  main_cover_image?: string;

  @Column({ type: 'jsonb', default: [] })
  internal_images?: string[];

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price_per_night: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cleaning_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  final_price?: number;

  @Column({ default: false })
  discount: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  average_rating: number;

  @Column({ type: 'int', default: 1 })
  room_count: number;

  @Column({ type: 'int', default: 1 })
  bed_count: number;

  @Column({ type: 'int', default: 1 })
  bathroom_count: number;

  @Column({ type: 'int', default: 1 })
  guest_capacity: number;

  @Column({ type: 'enum', enum: Category, default: Category.INN })
  category: Category;

  @Column({ type: 'enum', enum: SpaceType, default: SpaceType.FULL_SPACE })
  space_type: SpaceType;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ nullable: true })
  postal_code?: string;

  @Column({ nullable: true })
  uf?: string;

  @Column({ default: false })
  wifi: boolean;

  @Column({ default: false })
  tv: boolean;

  @Column({ default: false })
  kitchen: boolean;

  @Column({ default: false })
  washing_machine: boolean;

  @Column({ default: false })
  parking_included: boolean;

  @Column({ default: false })
  air_conditioning: boolean;

  @Column({ default: false })
  pool: boolean;

  @Column({ default: false })
  jacuzzi: boolean;

  @Column({ default: false })
  grill: boolean;

  @Column({ default: false })
  private_gym: boolean;

  @Column({ default: false })
  beach_access: boolean;

  @Column({ default: false })
  smoke_detector: boolean;

  @Column({ default: false })
  fire_extinguisher: boolean;

  @Column({ default: false })
  first_aid_kit: boolean;

  @Column({ default: false })
  outdoor_camera: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
