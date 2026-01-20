import { Body, Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from '../dtos';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/types';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(@CurrentUser() user: JwtUser, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking({
      accommodationId: dto.accommodationId,
      hostId: dto.hostId,
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      guestId: user.userId,
    });
  }

  @Post(':id/cancel')
  async cancel(@Param('id') bookingId: string) {
    return this.bookingService.cancelBooking(bookingId);
  }

  @Get('accommodation/:accommodationId')
  async findByAccommodation(@Param('accommodationId') accommodationId: string) {
    return this.bookingService.getBookingsByAccommodation(accommodationId);
  }
}
