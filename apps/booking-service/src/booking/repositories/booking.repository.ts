import { DataSource, Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Injectable } from '@nestjs/common';
import { BookingStatus } from '../enums/booking-status.enum';
 import { parseISO } from 'date-fns';

@Injectable()
export class BookingRepository extends Repository<Booking> {
  constructor(dataSource: DataSource) {
    super(Booking, dataSource.createEntityManager());
  }

  async hasDateConflict(
    accommodationId: string,
    checkInDate: string,
    checkOutDate: string,
    includePending = false,
  ): Promise<boolean> {
    const checkIn = parseISO(checkInDate);
    const checkOut = parseISO(checkOutDate);

    try {
      const qb = this.createQueryBuilder('booking')
        .where('booking.accommodationId = :accommodationId', {
          accommodationId,
        })
        .andWhere(
          `booking.checkInDate < :checkOutDate AND booking.checkOutDate > :checkInDate`,
          { checkInDate: checkIn, checkOutDate: checkOut },
        );

      if (includePending) {
        qb.andWhere('booking.status IN (:...statuses)', {
          statuses: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
        });
      } else {
        qb.andWhere('booking.status = :status', {
          status: BookingStatus.CONFIRMED,
        });
      }

      const conflict = await qb.getOne();
      return !!conflict;
    } catch (error) {
      console.error('[HAS_DATE_CONFLICT] ERRO NA QUERY:', error);
      throw error;
    }
  }

  async findByAccommodation(accommodationId: string): Promise<Booking[]> {
    try {
      const qb = this.createQueryBuilder('booking')
        .where('booking.accommodationId = :accommodationId', {
          accommodationId,
        })
        .orderBy('booking.checkInDate', 'ASC');

      const results = await qb.getMany();

      return results;
    } catch (error) {
      console.error('[FIND_BY_ACCOMMODATION] ERRO:', error);
      throw error;
    }
  }

  async findByUser(
    userId: string,
    role?: 'guest' | 'host',
  ): Promise<Booking[]> {
    try {
      const qb = this.createQueryBuilder('booking');

      if (role === 'guest') {
        qb.where('booking.guestId = :userId', { userId });
      } else if (role === 'host') {
        qb.where('booking.hostId = :userId', { userId });
      } else {
        qb.where('booking.guestId = :userId OR booking.hostId = :userId', {
          userId,
        });
      }

      qb.orderBy('booking.checkInDate', 'ASC');

      return await qb.getMany();
    } catch (error) {
      console.error('[FIND_BY_USER] ERRO:', error);
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    await this.delete({ id });
  }

  async hasConfirmedConflict(
    accommodationId: string,
    checkInDate: string,
    checkOutDate: string,
  ): Promise<boolean> {
    return this.hasDateConflict(
      accommodationId,
      checkInDate,
      checkOutDate,
      false,
    );
  }

  async hasAnyConflict(
    accommodationId: string,
    checkInDate: string,
    checkOutDate: string,
  ): Promise<boolean> {
    return this.hasDateConflict(
      accommodationId,
      checkInDate,
      checkOutDate,
      true,
    );
  }
}
