import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Accommodation } from './accommodation.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  content!: string;

  @Column('uuid')
  authorId!: string;

  @Column()
  authorName!: string;

  @Column({ type: 'int' })
  rating!: number;

  @ManyToOne(() => Accommodation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accommodationId' })
  accommodation!: Accommodation;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
