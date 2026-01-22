import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { ConfirmBookingDto, CreateBookingDto } from '../dtos';
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

  @Post('confirm')
  async confirmBooking(
    @Body() dto: ConfirmBookingDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.bookingService.confirmBooking({
      bookingId: dto.bookingId,
      hostId: user.userId,
    });
  }

  @Post(':id/cancel')
  async cancel(@Param('id') bookingId: string, @CurrentUser() user: JwtUser) {
    return this.bookingService.cancelBooking(bookingId, user.userId);
  }

  @Get('accommodation/:accommodationId')
  async findByAccommodation(@Param('accommodationId') accommodationId: string) {
    return this.bookingService.getBookingsByAccommodation(accommodationId);
  }

  @Get('user')
  async findByUser(@CurrentUser() user: JwtUser) {
    return this.bookingService.getBookingsByUser(user.userId);
  }

  @Delete('dev/clear-all')
  async clearAllBookings() {
    return this.bookingService.clearAllBookings();
  }
}
