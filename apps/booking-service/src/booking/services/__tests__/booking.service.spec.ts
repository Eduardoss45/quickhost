import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from '../booking.service';
import { BookingRepository } from '../../repositories/booking.repository';
import { ClientProxy } from '@nestjs/microservices';
import { BookingStatus } from '../../enums/booking-status.enum';
import { of } from 'rxjs';

const futureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

describe('BookingService', () => {
  let service: BookingService;
  let bookings: jest.Mocked<BookingRepository>;
  let accommodationClient: jest.Mocked<ClientProxy>;
  let notificationsClient: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: BookingRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            count: jest.fn(),
            hasConfirmedConflict: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByAccommodation: jest.fn(),
            findByUser: jest.fn(),
            createQueryBuilder: jest.fn(),
            manager: {
              transaction: jest.fn(),
            },
          },
        },
        {
          provide: 'ACCOMMODATIONS_CLIENT',
          useValue: { send: jest.fn() },
        },
        {
          provide: 'NOTIFICATIONS_EVENTS',
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(BookingService);
    bookings = module.get(BookingRepository);
    accommodationClient = module.get('ACCOMMODATIONS_CLIENT');
    notificationsClient = module.get('NOTIFICATIONS_EVENTS');

    (bookings.manager.transaction as jest.Mock).mockImplementation(
      async (cb: any) =>
        cb({
          getRepository: () => ({
            createQueryBuilder: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              update: jest.fn().mockReturnThis(),
              set: jest.fn().mockReturnThis(),
              execute: jest.fn(),
            }),
          }),
        }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createBooking', () => {
    it('cria uma reserva com sucesso', async () => {
      accommodationClient.send.mockReturnValue(
        of({
          id: 'acc',
          creator_id: 'host',
          is_active: true,
          price_per_night: 100,
          cleaning_fee: 50,
          title: 'Casa',
        }),
      );

      bookings.count.mockResolvedValue(0);
      bookings.hasConfirmedConflict.mockResolvedValue(false);
      bookings.create.mockReturnValue({ id: 'booking-id' } as any);
      bookings.save.mockResolvedValue({ id: 'booking-id' } as any);

      const result = await service.createBooking({
        accommodationId: 'acc',
        hostId: 'host',
        guestId: 'guest',
        checkInDate: futureDate(2),
        checkOutDate: futureDate(4),
      });

      expect(result.id).toBe('booking-id');
      expect(notificationsClient.emit).toHaveBeenCalled();
    });
  });

  describe('cancelBooking', () => {
    it('cancela a reserva com sucesso', async () => {
      jest
        .spyOn(service as any, 'syncAvailability')
        .mockResolvedValue(undefined);

      bookings.findOneBy.mockResolvedValue({
        id: 'booking',
        hostId: 'host',
        guestId: 'guest',
        accommodationId: 'acc',
        status: BookingStatus.PENDING,
        checkInDate: '2026-01-10',
        checkOutDate: '2026-01-12',
      } as any);

      accommodationClient.send.mockReturnValue(of({ title: 'Casa' }));

      await service.cancelBooking('booking', 'host');

      expect(bookings.update).toHaveBeenCalled();
      expect(notificationsClient.emit).toHaveBeenCalled();
    });

    it('não executa nenhuma ação se a reserva já estiver cancelada', async () => {
      bookings.findOneBy.mockResolvedValue({
        status: BookingStatus.CANCELED,
        hostId: 'host',
        guestId: 'guest',
      } as any);

      await service.cancelBooking('booking', 'host');

      expect(bookings.update).not.toHaveBeenCalled();
    });
  });

  describe('confirmBooking', () => {
    it('confirma a reserva com sucesso', async () => {
      const repoMock = {
        findOne: jest.fn().mockResolvedValue({
          id: 'b1',
          hostId: 'host',
          guestId: 'guest',
          accommodationId: 'acc',
          status: BookingStatus.PENDING,
          checkInDate: futureDate(2),
          checkOutDate: futureDate(4),
        }),
        save: jest.fn().mockResolvedValue({ id: 'b1' }),
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          setLock: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null),
          update: jest.fn().mockReturnThis(),
          set: jest.fn().mockReturnThis(),
          execute: jest.fn(),
        }),
      };

      (bookings.manager.transaction as jest.Mock).mockImplementation(
        async (cb: any) => cb({ getRepository: () => repoMock }),
      );

      accommodationClient.send.mockReturnValue(of({ title: 'Casa' }));

      const result = await service.confirmBooking('b1', 'host');

      expect(result.id).toBe('b1');
      expect(notificationsClient.emit).toHaveBeenCalled();
    });
  });

  describe('deleteExpiredConfirmedBookings', () => {
    it('remove reservas confirmadas expiradas (incluindo checkout na data atual) e sincroniza a disponibilidade', async () => {
      const expiredRows = [
        { id: 'b1', accommodationId: 'acc-1' },
        { id: 'b2', accommodationId: 'acc-1' },
        { id: 'b3', accommodationId: 'acc-2' },
      ];

      const selectQb = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(expiredRows),
      };

      const deleteQb = {
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 3 }),
      };

      bookings.createQueryBuilder
        .mockReturnValueOnce(selectQb as any)
        .mockReturnValueOnce(deleteQb as any);

      const syncSpy = jest
        .spyOn(service as any, 'syncAvailability')
        .mockResolvedValue(undefined);

      const result = await service.deleteExpiredConfirmedBookings();

      expect(selectQb.andWhere).toHaveBeenCalledWith(
        'booking.checkOutDate <= :today',
        expect.any(Object),
      );

      expect(deleteQb.where).toHaveBeenCalledWith('id IN (:...ids)', {
        ids: ['b1', 'b2', 'b3'],
      });

      expect(syncSpy).toHaveBeenCalledTimes(2);
      expect(syncSpy).toHaveBeenCalledWith('acc-1');
      expect(syncSpy).toHaveBeenCalledWith('acc-2');
      expect(result).toEqual({ affected: 3 });
    });
  });
});
