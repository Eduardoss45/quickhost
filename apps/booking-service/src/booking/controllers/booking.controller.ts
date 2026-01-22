import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { BookingService } from '../services/booking.service';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern('booking.create')
  async handleCreateBooking(
    @Payload()
    payload: {
      accommodationId: string;
      hostId: string;
      guestId: string;
      checkOutDate: string;
      checkInDate: string;
    },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const booking = await this.bookingService.createBooking(payload);

      channel.ack(message);

      return {
        bookingId: booking.id,
        status: booking.status,
      };
    } catch (error) {
      console.error('[RMQ] Erro em booking.create:', error);

      channel.ack(message);

      throw error;
    }
  }

  @MessagePattern('booking.cancel')
  async handleCancelBooking(
    @Payload() payload: { bookingId: string; actorId: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.bookingService.cancelBooking(
        payload.bookingId,
        payload.actorId,
      );
      channel.ack(message);
      return { success: true };
    } catch (error) {
      channel.ack(message);
      throw error;
    }
  }

  @MessagePattern('booking.find_by_accommodation')
  async handleFindByAccommodation(
    @Payload() payload: { accommodationId: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.bookingService.getBookingsByAccommodation(
        payload.accommodationId,
      );

      channel.ack(message);
      return result;
    } catch (error) {
      channel.ack(message);
      throw error;
    }
  }

  @MessagePattern('booking.find_by_user')
  async handleFindByUser(
    @Payload()
    payload: {
      userId: string;
      role?: 'guest' | 'host';
    },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.bookingService.getBookingsByUser(
        payload.userId,
        payload.role,
      );

      channel.ack(message);
      return result;
    } catch (error) {
      channel.ack(message);
      throw error;
    }
  }

  @MessagePattern('booking.confirm')
  async handleConfirmBooking(
    @Payload()
    payload: {
      bookingId: string;
      hostId: string;
    },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const booking = await this.bookingService.confirmBooking(
        payload.bookingId,
        payload.hostId,
      );

      channel.ack(message);

      return {
        bookingId: booking.id,
        status: booking.status,
      };
    } catch (error) {
      channel.ack(message);
      throw error;
    }
  }

  @MessagePattern('booking.dev.clear_all')
  async clearAllBookings(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const result = await this.bookingService.deleteAllBookings();
      channel.ack(message);
      return result;
    } catch (error) {
      console.error('[RMQ] Erro em booking.dev.clear_all:', error);
      channel.ack(message);
      throw error;
    }
  }
}
