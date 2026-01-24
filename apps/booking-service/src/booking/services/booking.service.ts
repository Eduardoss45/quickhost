import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BookingRepository } from '../repositories/booking.repository';
import { Booking } from '../entities/booking.entity';
import { BookingStatus } from '../enums/booking-status.enum';
import {
  differenceInCalendarDays,
  addDays,
  parseISO,
  isBefore,
  startOfDay,
} from 'date-fns';

@Injectable()
export class BookingService {
  private async accommodationExists(accommodationId: string): Promise<boolean> {
    try {
      const accommodation = await firstValueFrom(
        this.accommodationClient.send(
          'accommodation.find_one',
          accommodationId,
        ),
      );

      return !!accommodation;
    } catch {
      return false;
    }
  }

  constructor(
    private readonly bookingRepository: BookingRepository,
    @Inject('ACCOMMODATIONS_CLIENT')
    private readonly accommodationClient: ClientProxy,
    @Inject('NOTIFICATIONS_EVENTS')
    private readonly notificationsClient: ClientProxy,
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
    const checkIn = parseISO(data.checkInDate);
    const checkOut = parseISO(data.checkOutDate);

    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);

    if (isBefore(checkIn, tomorrow)) {
      throw new RpcException({
        statusCode: 400,
        message: 'Check-in must be at least one day in the future',
      });
    }

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

  private async syncAvailability(
    accommodationId: string,
    newCheckOutDate?: string,
  ) {
    let nextDate: string | null = null;

    if (newCheckOutDate) {
      nextDate = newCheckOutDate;
    } else {
      const result = await this.bookingRepository
        .createQueryBuilder('b')
        .select('MAX(b."checkOutDate")', 'next')
        .where('b."accommodationId" = :id', { id: accommodationId })
        .andWhere('b.status = :status', { status: BookingStatus.CONFIRMED })
        .getRawOne();

      nextDate = result?.next ?? null;
    }

    await firstValueFrom(
      this.accommodationClient.send(
        'accommodation.update_next_available_date',
        {
          accommodationId,
          date: nextDate,
        },
      ),
    );
  }

  async createBooking(data: {
    accommodationId: string;
    hostId: string;
    guestId: string;
    checkInDate: string;
    checkOutDate: string;
  }): Promise<Booking> {
    if (data.hostId === data.guestId) {
      throw new RpcException({
        statusCode: 409,
        message: 'Host cannot create a booking for their own accommodation',
      });
    }

    const accommodation = await firstValueFrom(
      this.accommodationClient.send(
        'accommodation.find_one',
        data.accommodationId,
      ),
    );

    if (!accommodation) {
      throw new RpcException({
        statusCode: 404,
        message: 'Accommodation not found',
      });
    }

    if (accommodation.creator_id !== data.hostId) {
      throw new RpcException({
        statusCode: 403,
        message: 'Invalid host for this accommodation',
      });
    }

    if (!accommodation.is_active) {
      throw new RpcException({
        statusCode: 409,
        message: 'Accommodation is not active',
      });
    }

    const pendingCount = await this.bookingRepository.count({
      where: {
        accommodationId: data.accommodationId,
        status: BookingStatus.PENDING,
      },
    });

    if (pendingCount >= 3) {
      throw new RpcException({
        statusCode: 409,
        message: 'Maximum of 3 pending bookings allowed for this accommodation',
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

    const hasConflict = await this.bookingRepository.hasConfirmedConflict(
      data.accommodationId,
      data.checkInDate,
      data.checkOutDate,
    );

    if (hasConflict) {
      throw new RpcException({
        statusCode: 409,
        message: 'Cannot create booking: conflicting reservation exists',
      });
    }

    const booking = this.buildBooking({
      ...data,
      pricePerNight,
      cleaningFee,
    });

    try {
      const saved = await this.bookingRepository.save(booking);

      this.notificationsClient.emit('booking.created', {
        bookingId: saved.id,
        hostId: saved.hostId,
        guestId: saved.guestId,
        accommodationTitle: accommodation.title ?? 'Accommodation',
        checkInDate: saved.checkInDate,
        checkOutDate: saved.checkOutDate,
      });

      return saved;
    } catch (error) {
      console.error('[BOOKING_CREATE_ERROR]', error);

      throw new RpcException({
        statusCode: 500,
        message: 'Failed to create booking. Please try again.',
      });
    }
  }

  async cancelBooking(bookingId: string, actorId: string): Promise<void> {
    const booking = await this.bookingRepository.findOneBy({ id: bookingId });

    if (!booking) {
      throw new RpcException({ statusCode: 404, message: 'Booking not found' });
    }

    if (actorId !== booking.hostId && actorId !== booking.guestId) {
      throw new RpcException({
        statusCode: 403,
        message: 'You are not allowed to cancel this booking',
      });
    }

    if (booking.status === BookingStatus.CANCELED) {
      return;
    }

    await this.bookingRepository.update(
      { id: bookingId },
      { status: BookingStatus.CANCELED },
    );

    const canceledBy: 'host' | 'guest' =
      actorId === booking.hostId ? 'host' : 'guest';

    const accommodation = await firstValueFrom(
      this.accommodationClient.send(
        'accommodation.find_one',
        booking.accommodationId,
      ),
    );

    this.notificationsClient.emit('booking.canceled', {
      bookingId: booking.id,
      hostId: booking.hostId,
      guestId: booking.guestId,
      canceledBy,
      accommodationTitle: accommodation.title,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
    });

    await this.syncAvailability(booking.accommodationId);
  }

  async getBookingsByAccommodation(
    accommodationId: string,
  ): Promise<Booking[]> {
    const exists = await this.accommodationExists(accommodationId);

    if (!exists) {
      await this.bookingRepository.delete({ accommodationId });
      return [];
    }

    return this.bookingRepository.findByAccommodation(accommodationId);
  }

  async getBookingsByUser(
    userId: string,
    role?: 'guest' | 'host',
  ): Promise<Booking[]> {
    if (!userId) {
      throw new RpcException({
        statusCode: 400,
        message: 'User ID is required',
      });
    }

    const bookings = await this.bookingRepository.findByUser(userId, role);

    if (bookings.length === 0) return [];

    const validBookings: Booking[] = [];

    for (const booking of bookings) {
      const exists = await this.accommodationExists(booking.accommodationId);

      if (!exists) {
        await this.bookingRepository.delete({ id: booking.id });
        continue;
      }

      validBookings.push(booking);
    }

    return validBookings;
  }

  async confirmBooking(bookingId: string, hostId: string): Promise<Booking> {
    return this.bookingRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(Booking);

      const booking = await repo.findOne({
        where: { id: bookingId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!booking)
        throw new RpcException({
          statusCode: 404,
          message: 'Booking not found',
        });

      if (booking.hostId !== hostId)
        throw new RpcException({
          statusCode: 403,
          message: 'Only the host can confirm this booking',
        });

      if (booking.status !== BookingStatus.PENDING)
        throw new RpcException({
          statusCode: 409,
          message: 'Only pending bookings can be confirmed',
        });

      const conflict = await repo
        .createQueryBuilder('booking')
        .where('booking.accommodationId = :accommodationId', {
          accommodationId: booking.accommodationId,
        })
        .andWhere(
          'booking.checkInDate < :checkOutDate AND booking.checkOutDate > :checkInDate',
          {
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
          },
        )
        .andWhere('booking.status = :status', {
          status: BookingStatus.CONFIRMED,
        })
        .setLock('pessimistic_read')
        .getOne();

      if (conflict)
        throw new RpcException({
          statusCode: 409,
          message:
            'Cannot confirm: another booking is already confirmed for this period',
        });

      booking.status = BookingStatus.CONFIRMED;
      const saved = await repo.save(booking);

      await repo
        .createQueryBuilder()
        .update(Booking)
        .set({ status: BookingStatus.CANCELED })
        .where('accommodationId = :accommodationId', {
          accommodationId: booking.accommodationId,
        })
        .andWhere(
          'checkInDate < :checkOutDate AND checkOutDate > :checkInDate',
          {
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
          },
        )
        .andWhere('status = :status', { status: BookingStatus.PENDING })
        .execute();

      const accommodation = await firstValueFrom(
        this.accommodationClient.send(
          'accommodation.find_one',
          booking.accommodationId,
        ),
      );

      this.notificationsClient.emit('booking.confirmed', {
        bookingId: saved.id,
        hostId: saved.hostId,
        guestId: saved.guestId,
        accommodationTitle: accommodation.title,
        checkInDate: saved.checkInDate,
        checkOutDate: saved.checkOutDate,
      });

      await this.syncAvailability(
        booking.accommodationId,
        booking.checkOutDate,
      );

      return saved;
    });
  }

  async deleteBookingsByStatusBefore(status: BookingStatus, before: Date) {
    const result = await this.bookingRepository
      .createQueryBuilder()
      .delete()
      .from(Booking)
      .where('status = :status', { status })
      .andWhere('updatedAt < :before', { before })
      .execute();

    return { affected: result.affected ?? 0 };
  }

  async deleteAllBookings(): Promise<{ affected: number }> {
    const result = await this.bookingRepository
      .createQueryBuilder()
      .delete()
      .from(Booking)
      .execute();

    return { affected: result.affected ?? 0 };
  }

  async deleteExpiredConfirmedBookings(): Promise<{ affected: number }> {
    const today = startOfDay(new Date());

    const result = await this.bookingRepository
      .createQueryBuilder()
      .delete()
      .from(Booking)
      .where('status = :status', { status: BookingStatus.CONFIRMED })
      .andWhere('checkOutDate < :today', { today })
      .execute();

    return { affected: result.affected ?? 0 };
  }
}
