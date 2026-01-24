import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../../../repositories/user.repository';
import { FavoritesRepository } from '../../../repositories/favorites.repository';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let users: jest.Mocked<UserRepository>;
  let favorites: jest.Mocked<FavoritesRepository>;
  let mediaClient: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
            findByUsername: jest.fn(),
            updateProfile: jest.fn(),
            findPublicById: jest.fn(),
          },
        },
        {
          provide: FavoritesRepository,
          useValue: {
            add: jest.fn(),
            remove: jest.fn(),
            listByUser: jest.fn(),
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

    service = module.get(UserService);
    users = module.get(UserRepository);
    favorites = module.get(FavoritesRepository);
    mediaClient = module.get('MEDIA_CLIENT');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('atualiza perfil com sucesso (username)', async () => {
    users.findById.mockResolvedValue({ id: 'user-id' } as any);
    users.findByUsername.mockResolvedValue(null as any);
    users.updateProfile.mockResolvedValue({} as any);

    const result = await service.updateProfile('user-id', {
      username: 'novo_nome',
    });

    expect(users.updateProfile).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it('falha se usuário não existir', async () => {
    users.findById.mockResolvedValue(null);

    await expect(service.updateProfile('user-id', {})).rejects.toBeInstanceOf(
      RpcException,
    );
  });

  it('falha se username já estiver em uso', async () => {
    users.findById.mockResolvedValue({ id: 'user-id' } as any);
    users.findByUsername.mockResolvedValue({ id: 'other' } as any);

    await expect(
      service.updateProfile('user-id', { username: 'existente' }),
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('falha se idade for menor que 18 anos', async () => {
    users.findById.mockResolvedValue({ id: 'user-id' } as any);

    await expect(
      service.updateProfile('user-id', { birth_date: '2010-01-01' } as any),
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('faz upload de imagem de perfil', async () => {
    users.findById.mockResolvedValue({ id: 'user-id' } as any);
    users.updateProfile.mockResolvedValue({} as any);

    mediaClient.send.mockReturnValue(of('image-url'));

    const result = await service.updateProfile(
      'user-id',
      {},
      {
        buffer: 'file',
        originalName: 'image.png',
        mimetype: 'image/png',
      },
    );

    expect(mediaClient.send).toHaveBeenCalledWith(
      'upload-profile-image',
      expect.any(Object),
    );
    expect(result.success).toBe(true);
  });

  it('propaga erro do serviço de mídia', async () => {
    users.findById.mockResolvedValue({ id: 'user-id' } as any);

    mediaClient.send.mockReturnValue(
      throwError(() => ({
        response: {
          statusCode: 400,
          message: 'Imagem inválida',
        },
      })),
    );

    await expect(
      service.updateProfile(
        'user-id',
        {},
        {
          buffer: 'file',
          originalName: 'img.png',
          mimetype: 'image/png',
        },
      ),
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('retorna perfil do usuário', async () => {
    users.findById.mockResolvedValue({
      id: 'user-id',
      password: 'secret',
      refreshTokenHash: 'hash',
      email: 'user@email.com',
    } as any);

    const result = await service.getProfile('user-id');

    expect((result as any).password).toBeUndefined();
    expect((result as any).refreshTokenHash).toBeUndefined();
  });

  it('falha ao buscar perfil inexistente', async () => {
    users.findById.mockResolvedValue(null);

    await expect(service.getProfile('user-id')).rejects.toBeInstanceOf(
      RpcException,
    );
  });

  it('remove foto de perfil com sucesso', async () => {
    users.findById.mockResolvedValue({
      id: 'user-id',
      profile_picture_url: 'path/image.png',
    } as any);

    mediaClient.send.mockReturnValue(of(true));
    users.updateProfile.mockResolvedValue({} as any);

    const result = await service.removeProfilePicture('user-id');

    expect(mediaClient.send).toHaveBeenCalledWith(
      'remove-profile-image',
      expect.any(Object),
    );
    expect(result.success).toBe(true);
  });

  it('não remove foto se usuário não possuir imagem', async () => {
    users.findById.mockResolvedValue({
      id: 'user-id',
      profile_picture_url: null,
    } as any);

    const result = await service.removeProfilePicture('user-id');

    expect(result.message).toContain('não possui foto');
  });

  it('retorna usuário público', async () => {
    users.findPublicById.mockResolvedValue({ id: 'user-id' } as any);

    const result = await service.getPublicUser('user-id');

    expect(result.id).toBe('user-id');
  });

  it('falha ao buscar usuário público inexistente', async () => {
    users.findPublicById.mockResolvedValue(null);

    await expect(service.getPublicUser('user-id')).rejects.toBeInstanceOf(
      RpcException,
    );
  });

  it('adiciona favorito com sucesso', async () => {
    favorites.add.mockResolvedValue(undefined as any);

    const result = await service.add('user-id', 'acc-id');

    expect(result).toBe('added');
  });

  it('falha ao adicionar favorito duplicado', async () => {
    favorites.add.mockRejectedValue({ code: '23505' });

    await expect(service.add('user-id', 'acc-id')).rejects.toBeInstanceOf(
      RpcException,
    );
  });

  it('remove favorito com sucesso', async () => {
    favorites.remove.mockResolvedValue(undefined as any);

    await expect(service.remove('user-id', 'acc-id')).resolves.toBeUndefined();
  });

  it('lista favoritos por usuário', async () => {
    favorites.listByUser.mockResolvedValue([{ id: 'fav-1' }] as any);

    const result = await service.listByUser('user-id');

    expect(result).toHaveLength(1);
    expect(favorites.listByUser).toHaveBeenCalledWith('user-id');
  });
});
