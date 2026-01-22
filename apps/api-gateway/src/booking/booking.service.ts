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

  cancelBooking(bookingId: string, actorId: string) {
    return firstValueFrom(
      this.client.send('booking.cancel', { bookingId, actorId }),
    );
  }

  getBookingsByAccommodation(accommodationId: string) {
    return firstValueFrom(
      this.client.send('booking.find_by_accommodation', { accommodationId }),
    );
  }

  getBookingsByUser(userId: string) {
    return firstValueFrom(this.client.send('booking.find_by_user', { userId }));
  }

  async confirmBooking(data: {
    bookingId: string;
    hostId: string;
  }): Promise<{ bookingId: string; status: string }> {
    return await firstValueFrom(this.client.send('booking.confirm', data));
  }

  async clearAllBookings() {
    return this.client.send('booking.dev.clear_all', {});
  }
}
