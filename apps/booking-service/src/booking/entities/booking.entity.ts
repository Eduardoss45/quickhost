import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { BookingStatus } from '../enums/booking-status.enum';

@Entity('bookings')
@Index(['accommodationId', 'checkInDate', 'checkOutDate'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  accommodationId: string;

  @Column({ type: 'uuid' })
  hostId: string;

  @Column({ type: 'uuid' })
  guestId: string;

  @Column({ type: 'date' })
  checkInDate: string;

  @Column({ type: 'date' })
  checkOutDate: string;

  @Column({ type: 'int' })
  totalDays: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerNight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cleaningFee: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  serviceFeeMultiplier: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  finalAmount: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
