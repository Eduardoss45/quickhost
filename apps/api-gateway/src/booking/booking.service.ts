// booking/booking.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BookingService {
  constructor(
    @Inject('BOOKING_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  createBooking(payload: {
    accommodationId: string;
    hostId: string;
    guestId: string;
    checkInDate: string;
    checkOutDate: string;
  }) {
    return firstValueFrom(this.client.send('booking.create', payload));
  }

  cancelBooking(bookingId: string) {
    return firstValueFrom(this.client.send('booking.cancel', { bookingId }));
  }

  getBookingsByAccommodation(accommodationId: string) {
    return firstValueFrom(
      this.client.send('booking.find_by_accommodation', { accommodationId }),
    );
  }
}
