import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { BookingRepository } from '../repositories/booking.repository';
import { Booking } from '../entities/booking.entity';
import { BookingStatus } from '../enums/booking-status.enum';
import { differenceInCalendarDays } from 'date-fns';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,

    @Inject('ACCOMMODATIONS_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  private buildBooking(data: {
    accommodationId: string;
    hostId: string;
    guestId: string;
    checkInDate: string;
    checkOutDate: string;
    pricePerNight: number;
    cleaningFee: number;
  }): Booking {
    function parseDateOnly(date: string) {
      const [year, month, day] = date.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    const checkIn = parseDateOnly(data.checkInDate);
    const checkOut = parseDateOnly(data.checkOutDate);

    const totalDays = differenceInCalendarDays(checkOut, checkIn);

    if (totalDays <= 0) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid booking period',
      });
    }

    if (totalDays > 30) {
      throw new RpcException({
        statusCode: 400,
        message: 'Maximum stay is 30 nights',
      });
    }

    const serviceFeeMultiplier = 1.15;
    const subtotal = totalDays * data.pricePerNight;
    const finalAmount =
      Math.round((subtotal + data.cleaningFee) * serviceFeeMultiplier * 100) /
      100;

    return this.bookingRepository.create({
      accommodationId: data.accommodationId,
      hostId: data.hostId,
      guestId: data.guestId,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      totalDays,
      pricePerNight: data.pricePerNight,
      cleaningFee: data.cleaningFee,
      serviceFeeMultiplier,
      finalAmount,
      status: BookingStatus.PENDING,
    });
  }

  private async syncAvailability(accommodationId: string) {
    const result = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('MAX(booking.checkOutDate)', 'next')
      .where('booking.accommodationId = :id', { id: accommodationId })
      .andWhere('booking.status IN (:...statuses)', {
        statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
      })
      .getRawOne();

    const nextDate = result?.next ?? null;

    await firstValueFrom(
      this.client.send('accommodation.update_next_available_date', {
        accommodationId,
        date: nextDate,
      }),
    );
  }

  async createBooking(data: {
    accommodationId: string;
    hostId: string;
    guestId: string;
    checkInDate: string;
    checkOutDate: string;
  }): Promise<Booking> {
    const accommodation = await firstValueFrom(
      this.client.send('accommodation.find_one', data.accommodationId),
    );

    if (!accommodation) {
      throw new RpcException({
        statusCode: 404,
        message: 'Accommodation not found',
      });
    }

    if (!accommodation.is_active) {
      throw new RpcException({
        statusCode: 409,
        message: 'Accommodation is not active',
      });
    }

    const pricePerNight = Number(accommodation.price_per_night);
    const cleaningFee = Number(accommodation.cleaning_fee ?? 0);

    if (Number.isNaN(pricePerNight) || Number.isNaN(cleaningFee)) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid pricing data',
      });
    }

    const hasConflict = await this.bookingRepository.hasDateConflict(
      data.accommodationId,
      data.checkInDate,
      data.checkOutDate,
    );

    if (hasConflict) {
      throw new RpcException({
        statusCode: 409,
        message: 'Accommodation already booked for this period',
      });
    }

    const booking = this.buildBooking({
      ...data,
      pricePerNight,
      cleaningFee,
    });

    try {
      const saved = await this.bookingRepository.save(booking);

      await this.syncAvailability(data.accommodationId);

      return saved;
    } catch (error) {
      console.error('[BOOKING_CREATE_ERROR]', error);

      throw new RpcException({
        statusCode: 500,
        message: 'Failed to create booking. Please try again.',
      });
    }
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const booking = await this.bookingRepository.findOneBy({ id: bookingId });

    if (!booking) {
      throw new RpcException({ statusCode: 404, message: 'Booking not found' });
    }

    await this.bookingRepository.update(
      { id: bookingId },
      { status: BookingStatus.CANCELED },
    );

    await this.syncAvailability(booking.accommodationId);
  }

  async getBookingsByAccommodation(
    accommodationId: string,
  ): Promise<Booking[]> {
    return this.bookingRepository.findByAccommodation(accommodationId);
  }
}
