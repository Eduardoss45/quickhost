import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BookingService } from '../services/booking.service';
import { BookingStatus } from '../enums/booking-status.enum';

@Injectable()
export class BookingCleanupJob {
  private readonly logger = new Logger(BookingCleanupJob.name);

  constructor(private readonly bookingService: BookingService) {}

  @Cron('*/5 * * * *')
  async handleCleanup() {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      const result = await this.bookingService.deleteBookingsByStatusBefore(
        BookingStatus.CANCELED,
        fiveMinutesAgo,
      );

      if (result?.affected > 0) {
        this.logger.log(
          `Removed ${result.affected} canceled bookings older than 5 minutes`,
        );
      }
    } catch (error) {
      this.logger.error(
        'Error while cleaning canceled bookings',
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
