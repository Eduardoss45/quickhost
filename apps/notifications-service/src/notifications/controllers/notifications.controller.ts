import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { NotificationsService } from '../services/notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @EventPattern('booking.created')
  onBookingCreated(data: any) {
    return this.service.handleBookingCreated(data);
  }

  @EventPattern('booking.confirmed')
  onBookingConfirmed(data: any) {
    return this.service.handleBookingConfirmed(data);
  }

  @EventPattern('booking.canceled')
  onBookingCanceled(data: any) {
    return this.service.handleBookingCanceled(data);
  }
}
