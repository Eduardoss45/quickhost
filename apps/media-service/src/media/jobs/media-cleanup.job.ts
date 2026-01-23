import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MediaService } from '../services/media.service';

@Injectable()
export class MediaCleanupJob {
  constructor(private readonly mediaService: MediaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCleanup(): Promise<void> {
    try {
      await this.mediaService.cleanupUserUploads();
      await this.mediaService.cleanupAccommodationUploads();
    } catch (error) {}
  }
}
