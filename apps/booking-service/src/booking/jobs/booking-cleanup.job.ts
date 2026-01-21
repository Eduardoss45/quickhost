import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BookingService } from '../services/booking.service';

@Injectable()
export class BookingCleanupJob {
  private readonly logger = new Logger(BookingCleanupJob.name);

  constructor(private readonly bookingService: BookingService) {}

  @Cron('0 * * * *')
  async handleCleanup() {
    try {
      const result = await this.bookingService.deleteExpiredBookings(24);

      if (result?.affected > 0) {
        this.logger.log(`Removed ${result.affected} expired bookings`);
      }
    } catch (error) {
      this.logger.error(
        'Error while cleaning expired bookings',
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
