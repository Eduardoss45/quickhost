import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationService } from '../accommodation.service';
import { AccommodationRepository } from '../../repositories/accommodation.repository';
import { CommentRepository } from '../../repositories/comments.repository';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';

describe('AccommodationService', () => {
  let service: AccommodationService;
  let accommodations: jest.Mocked<AccommodationRepository>;
  let comments: jest.Mocked<CommentRepository>;
  let mediaClient: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccommodationService,
        {
          provide: AccommodationRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            findByCreatorId: jest.fn(),
          },
        },
        {
          provide: CommentRepository,
          useValue: {
            createCommentWithRatingUpdate: jest.fn(),
            findComments: jest.fn(),
          },
        },
        {
          provide: 'MEDIA_CLIENT',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AccommodationService);
    accommodations = module.get(AccommodationRepository);
    comments = module.get(CommentRepository);
    mediaClient = module.get('MEDIA_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('create', () => {
    it('cria uma acomodação com sucesso', async () => {
      accommodations.create.mockReturnValue({ id: 'acc-id' } as any);
      accommodations.save.mockResolvedValue({ id: 'acc-id' } as any);

      const result = await service.create({
        title: 'Test',
        creator_id: 'user-id',
      } as any);

      expect(accommodations.create).toHaveBeenCalled();
      expect(accommodations.save).toHaveBeenCalled();
      expect(result.id).toBe('acc-id');
    });
  });

  describe('update', () => {
    it('atualiza acomodação sem imagens raw', async () => {
      const accommodation = {
        id: 'acc-id',
        creator_id: 'user-id',
        title: 'Old',
      } as any;

      accommodations.findOne.mockResolvedValue(accommodation);
      accommodations.save.mockResolvedValue({
        ...accommodation,
        title: 'New',
      });

      const result = await service.update(
        'acc-id',
        { title: 'New' } as any,
        'user-id',
      );

      expect(mediaClient.send).not.toHaveBeenCalled();
      expect(result.title).toBe('New');
    });

    it('processa imagens se houver imagens raw', async () => {
      const accommodation = {
        id: 'acc-id',
        creator_id: 'user-id',
        main_cover_image: '/uploads/accommodations/acc-id/raw/cover.jpg',
        internal_images: ['/uploads/accommodations/acc-id/raw/1.jpg'],
      } as any;

      accommodations.findOne.mockResolvedValue(accommodation);

      mediaClient.send.mockReturnValue(
        of({
          cover: '/uploads/accommodations/acc-id/image0.jpeg',
          images: ['/uploads/accommodations/acc-id/image0.jpeg'],
        }),
      );

      accommodations.save.mockResolvedValue({
        ...accommodation,
        main_cover_image: '/uploads/accommodations/acc-id/image0.jpeg',
        internal_images: ['/uploads/accommodations/acc-id/image0.jpeg'],
      });

      const result = await service.update(
        'acc-id',
        {
          main_cover_image: accommodation.main_cover_image,
          internal_images: accommodation.internal_images,
        } as any,
        'user-id',
      );

      expect(mediaClient.send).toHaveBeenCalledWith(
        'process_accommodation_images',
        { accommodationId: 'acc-id' },
      );

      expect(result.main_cover_image).toContain('image0.jpeg');
    });

    it('falha se o usuário não for o criador', async () => {
      accommodations.findOne.mockResolvedValue({
        id: 'acc-id',
        creator_id: 'other-user',
      } as any);

      await expect(
        service.update('acc-id', {} as any, 'user-id'),
      ).rejects.toBeInstanceOf(RpcException);
    });

    it('lança RpcException se o processamento de imagens falhar', async () => {
      accommodations.findOne.mockResolvedValue({
        id: 'acc-id',
        creator_id: 'user-id',
        main_cover_image: '/raw/image.jpg',
      } as any);

      mediaClient.send.mockReturnValue(
        throwError(() => new Error('media error')),
      );

      await expect(
        service.update(
          'acc-id',
          { main_cover_image: '/raw/image.jpg' } as any,
          'user-id',
        ),
      ).rejects.toBeInstanceOf(RpcException);
    });
  });

  describe('removeImages', () => {
    it('remove imagens da acomodação', async () => {
      const accommodation = {
        id: 'acc-id',
        creator_id: 'user-id',
        main_cover_image: 'img.jpg',
        internal_images: ['img2.jpg'],
      } as any;

      accommodations.findOne.mockResolvedValue(accommodation);
      mediaClient.send.mockReturnValue(of(true));

      accommodations.save.mockResolvedValue({
        ...accommodation,
        main_cover_image: '',
        internal_images: [],
      });

      const result = await service.removeImages('acc-id', 'user-id');

      expect(mediaClient.send).toHaveBeenCalledWith(
        'remove-accommodation-images',
        { accommodationId: 'acc-id' },
      );

      expect(result.internal_images).toHaveLength(0);
    });

    it('falha ao remover imagens se não for o criador', async () => {
      accommodations.findOne.mockResolvedValue({
        id: 'acc-id',
        creator_id: 'other-user',
      } as any);

      await expect(
        service.removeImages('acc-id', 'user-id'),
      ).rejects.toBeInstanceOf(RpcException);
    });
  });
});
