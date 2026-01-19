import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  RelationId,
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

  @ManyToOne(() => Accommodation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accommodationId' })
  accommodation!: Accommodation;

  @Column('uuid')
  accommodationId!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
