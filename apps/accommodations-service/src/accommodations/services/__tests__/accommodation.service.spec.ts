import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationService } from '../accommodation.service';
import { AccommodationRepository } from '../../repositories/accommodation.repository';
import { CommentRepository } from '../../repositories/comments.repository';
import { RpcException } from '@nestjs/microservices';
import { BadRequestException } from '@nestjs/common';

describe('AccommodationService', () => {
  let service: AccommodationService;
  let accommodations: jest.Mocked<AccommodationRepository>;
  let comments: jest.Mocked<CommentRepository>;

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
      ],
    }).compile();

    service = module.get(AccommodationService);
    accommodations = module.get(AccommodationRepository);
    comments = module.get(CommentRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('cria uma acomodação com sucesso', async () => {
    const data = { title: 'Casa de Praia' } as any;

    accommodations.create.mockReturnValue(data);
    accommodations.save.mockResolvedValue({ id: 'acc-id', ...data });

    const result = await service.create(data);

    expect(accommodations.create).toHaveBeenCalledWith(data);
    expect(accommodations.save).toHaveBeenCalled();
    expect(result.id).toBe('acc-id');
  });

  it('retorna todas as acomodações', async () => {
    accommodations.find.mockResolvedValue([{ id: '1' }] as any);

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(accommodations.find).toHaveBeenCalled();
  });

  it('retorna uma acomodação por id', async () => {
    accommodations.findOne.mockResolvedValue({ id: 'acc-id' } as any);

    const result = await service.findOne('acc-id');

    expect(result.id).toBe('acc-id');
  });

  it('falha ao buscar acomodação inexistente', async () => {
    accommodations.findOne.mockResolvedValue(null);

    await expect(service.findOne('invalid-id')).rejects.toBeInstanceOf(
      RpcException,
    );
  });

  it('retorna acomodações por criador', async () => {
    accommodations.findByCreatorId.mockResolvedValue([{ id: '1' }] as any);

    const result = await service.findByCreator('creator-id');

    expect(accommodations.findByCreatorId).toHaveBeenCalledWith('creator-id');
    expect(result).toHaveLength(1);
  });

  it('atualiza acomodação se o usuário for o criador', async () => {
    accommodations.findOne.mockResolvedValue({
      id: 'acc-id',
      creator_id: 'user-id',
    } as any);

    accommodations.save.mockResolvedValue({
      id: 'acc-id',
      title: 'Nova',
    } as any);

    const result = await service.update('acc-id', { title: 'Nova' }, 'user-id');

    expect(result.title).toBe('Nova');
    expect(accommodations.save).toHaveBeenCalled();
  });

  it('falha ao atualizar acomodação de outro usuário', async () => {
    accommodations.findOne.mockResolvedValue({
      id: 'acc-id',
      creator_id: 'other-user',
    } as any);

    await expect(
      service.update('acc-id', {}, 'user-id'),
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('remove acomodação se o usuário for o criador', async () => {
    const accommodation = {
      id: 'acc-id',
      creator_id: 'user-id',
    } as any;

    accommodations.findOne.mockResolvedValue(accommodation);
    accommodations.remove.mockResolvedValue(accommodation);

    const result = await service.remove('acc-id', 'user-id');

    expect(accommodations.remove).toHaveBeenCalledWith(accommodation);
    expect(result).toEqual({ success: true });
  });

  it('falha ao remover acomodação de outro usuário', async () => {
    accommodations.findOne.mockResolvedValue({
      id: 'acc-id',
      creator_id: 'other-user',
    } as any);

    await expect(service.remove('acc-id', 'user-id')).rejects.toBeInstanceOf(
      RpcException,
    );
  });

  it('cria comentário com sucesso', async () => {
    accommodations.findOne.mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440000',
      creator_id: 'other-user',
    } as any);

    comments.createCommentWithRatingUpdate.mockResolvedValue({
      id: 'comment-id',
      content: 'Ótimo lugar',
      rating: 5,
      authorId: 'user-id',
      authorName: 'Edu',
      accommodationId: '550e8400-e29b-41d4-a716-446655440000',
    } as any);

    const result = await service.createComment({
      content: 'Ótimo lugar',
      rating: 5,
      authorId: 'user-id',
      authorName: 'Edu',
      accommodationId: '550e8400-e29b-41d4-a716-446655440000',
    });

    expect(accommodations.findOne).toHaveBeenCalledWith({
      where: { id: '550e8400-e29b-41d4-a716-446655440000' },
    });
    expect(comments.createCommentWithRatingUpdate).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 'comment-id');
  });

  it('falha se o autor for o criador', async () => {
    accommodations.findOne.mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440000',
      creator_id: 'user-id',
    } as any);

    await expect(
      service.createComment({
        content: 'Teste',
        rating: 5,
        authorId: 'user-id',
        authorName: 'Edu',
        accommodationId: '550e8400-e29b-41d4-a716-446655440000',
      }),
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('falha se a acomodação não existe', async () => {
    accommodations.findOne.mockResolvedValue(null);

    await expect(
      service.createComment({
        content: 'Teste',
        rating: 5,
        authorId: 'user-id',
        authorName: 'Edu',
        accommodationId: '550e8400-e29b-41d4-a716-446655440999',
      }),
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('falha ao criar comentário com accommodationId inválido', async () => {
    await expect(
      service.createComment({
        content: 'Teste',
        rating: 5,
        authorId: 'user-id',
        authorName: 'Edu',
        accommodationId: 'invalid',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('retorna comentários paginados', async () => {
    accommodations.findOne.mockResolvedValue({ id: 'acc-id' } as any);
    comments.findComments.mockResolvedValue([{ id: 'c1' }] as any);

    const result = await service.getComments(
      '550e8400-e29b-41d4-a716-446655440000',
      1,
      5,
    );

    expect(comments.findComments).toHaveBeenCalledWith('acc-id', 1, 5);
    expect(result).toHaveLength(1);
  });

  it('atualiza próxima data disponível', async () => {
    const accommodation = {
      id: 'acc-id',
      is_active: true,
      next_available_date: null,
    } as any;

    accommodations.findOne.mockResolvedValue(accommodation);
    accommodations.save.mockResolvedValue({
      ...accommodation,
      next_available_date: '2026-01-10',
      is_active: false,
    });

    const result = await service.updateNextAvailableDate(
      'acc-id',
      '2026-01-10',
    );

    expect(result.is_active).toBe(false);
    expect(accommodations.save).toHaveBeenCalled();
  });
});
