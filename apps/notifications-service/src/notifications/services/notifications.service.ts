import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationRepository } from '../repositories/notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notifications: NotificationRepository,

    @Inject('GATEWAY_NOTIFICATIONS_CLIENT')
    private readonly gatewayClient: ClientProxy,
  ) {}

  private async persistAndDispatch(userId: string, type: string, payload: any) {
    await this.notifications.create({ userId, type, payload });

    this.gatewayClient.emit('notification.dispatch', {
      userId,
      type,
      payload,
    });
  }

  async handleBookingCreated(event: {
    bookingId: string;
    hostId: string;
    guestId: string;
    accommodationTitle: string;
  }) {
    await this.persistAndDispatch(event.hostId, 'booking:created', event);
  }

  async handleBookingConfirmed(event: {
    bookingId: string;
    hostId: string;
    guestId: string;
    accommodationTitle: string;
  }) {
    await this.persistAndDispatch(event.guestId, 'booking:confirmed', event);
  }

  async handleBookingCanceled(event: {
    bookingId: string;
    hostId: string;
    guestId: string;
    canceledBy: 'host' | 'guest' | 'system';
    accommodationTitle: string;
  }) {
    await Promise.all([
      this.persistAndDispatch(event.hostId, 'booking:canceled', event),
      this.persistAndDispatch(event.guestId, 'booking:canceled', event),
    ]);
  }
}
