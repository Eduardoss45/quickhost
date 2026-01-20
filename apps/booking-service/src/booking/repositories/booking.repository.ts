import { DataSource, Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Injectable } from '@nestjs/common';
import { BookingStatus } from '../enums/booking-status.enum';

@Injectable()
export class BookingRepository extends Repository<Booking> {
  constructor(dataSource: DataSource) {
    super(Booking, dataSource.createEntityManager());
  }

  async hasDateConflict(
    accommodationId: string,
    checkInDate: string,
    checkOutDate: string,
  ): Promise<boolean> {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    try {
      const qb = this.createQueryBuilder('booking')
        .where('booking.accommodationId = :accommodationId', {
          accommodationId,
        })
        .andWhere('booking.status != :status', {
          status: BookingStatus.CANCELED,
        })
        .andWhere(
          `booking.checkInDate < :checkOutDate
           AND booking.checkOutDate > :checkInDate`,
          {
            checkInDate: checkIn,
            checkOutDate: checkOut,
          },
        );

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
}
