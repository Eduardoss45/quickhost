import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications.service';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationRepository } from '../../repositories/notifications.repository';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repository: jest.Mocked<NotificationRepository>;
  let gatewayClient: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: NotificationRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'GATEWAY_NOTIFICATIONS_CLIENT',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(NotificationsService);
    repository = module.get(NotificationRepository);
    gatewayClient = module.get('GATEWAY_NOTIFICATIONS_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleBookingCreated', () => {
    it('should persist and dispatch notification to host', async () => {
      const event = {
        bookingId: 'b1',
        hostId: 'host-1',
        guestId: 'guest-1',
        accommodationTitle: 'Nice place',
      };

      await service.handleBookingCreated(event);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith({
        userId: event.hostId,
        type: 'booking:created',
        payload: event,
      });

      expect(gatewayClient.emit).toHaveBeenCalledWith('notification.dispatch', {
        userId: event.hostId,
        type: 'booking:created',
        payload: event,
      });
    });
  });

  describe('handleBookingConfirmed', () => {
    it('should persist and dispatch notification to guest', async () => {
      const event = {
        bookingId: 'b1',
        hostId: 'host-1',
        guestId: 'guest-1',
        accommodationTitle: 'Nice place',
      };

      await service.handleBookingConfirmed(event);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith({
        userId: event.guestId,
        type: 'booking:confirmed',
        payload: event,
      });

      expect(gatewayClient.emit).toHaveBeenCalledWith('notification.dispatch', {
        userId: event.guestId,
        type: 'booking:confirmed',
        payload: event,
      });
    });
  });

  describe('handleBookingCanceled', () => {
    it('should persist and dispatch notifications to both users', async () => {
      const event = {
        bookingId: 'b1',
        hostId: 'host-1',
        guestId: 'guest-1',
        canceledBy: 'host' as const,
        accommodationTitle: 'Nice place',
      };

      await service.handleBookingCanceled(event);

      expect(repository.create).toHaveBeenCalledTimes(2);
      expect(gatewayClient.emit).toHaveBeenCalledTimes(2);

      expect(repository.create).toHaveBeenCalledWith({
        userId: event.hostId,
        type: 'booking:canceled',
        payload: event,
      });

      expect(repository.create).toHaveBeenCalledWith({
        userId: event.guestId,
        type: 'booking:canceled',
        payload: event,
      });

      expect(gatewayClient.emit).toHaveBeenCalledWith('notification.dispatch', {
        userId: event.hostId,
        type: 'booking:canceled',
        payload: event,
      });

      expect(gatewayClient.emit).toHaveBeenCalledWith('notification.dispatch', {
        userId: event.guestId,
        type: 'booking:canceled',
        payload: event,
      });
    });
  });
});
