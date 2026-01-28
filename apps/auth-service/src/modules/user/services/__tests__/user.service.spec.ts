jest.mock('../../../repositories/user.repository', () => ({
  UserRepository: jest.fn().mockImplementation(() => ({
    findById: jest.fn(),
    findByUsername: jest.fn(),
    updateProfile: jest.fn(),
    findPublicById: jest.fn(),
  })),
}));

jest.mock('../../../repositories/favorites.repository', () => ({
  FavoritesRepository: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
    listByUser: jest.fn(),
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../../../repositories/user.repository';
import { FavoritesRepository } from '../../../repositories/favorites.repository';
import { RpcException } from '@nestjs/microservices';
import * as fs from 'fs';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;

  const usersRepoMock = {
    findById: jest.fn(),
    findByUsername: jest.fn(),
    updateProfile: jest.fn(),
    findPublicById: jest.fn(),
  };

  const favoritesRepoMock = {
    add: jest.fn(),
    remove: jest.fn(),
    listByUser: jest.fn(),
  };

  const mediaClientMock = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: usersRepoMock,
        },
        {
          provide: FavoritesRepository,
          useValue: favoritesRepoMock,
        },
        {
          provide: 'MEDIA_CLIENT',
          useValue: mediaClientMock,
        },
      ],
    }).compile();

    service = module.get(UserService);
  });

  // ===========================
  // updateProfile
  // ===========================

  it('atualiza perfil com sucesso (username)', async () => {
    usersRepoMock.findById.mockResolvedValue({ id: 'user-id' });
    usersRepoMock.findByUsername.mockResolvedValue(null);
    usersRepoMock.updateProfile.mockResolvedValue(undefined);

    const result = await service.updateProfile('user-id', {
      username: 'novo_nome',
    });

    expect(result.success).toBe(true);
    expect(usersRepoMock.updateProfile).toHaveBeenCalled();
  });

  it('falha se usuário não existir', async () => {
    usersRepoMock.findById.mockResolvedValue(null);

    await expect(service.updateProfile('user-id', {})).rejects.toBeInstanceOf(
      RpcException,
    );
  });

  it('falha se username já estiver em uso', async () => {
    usersRepoMock.findById.mockResolvedValue({ id: 'user-id' });
    usersRepoMock.findByUsername.mockResolvedValue({ id: 'outro-id' });

    await expect(
      service.updateProfile('user-id', { username: 'existente' }),
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('falha se idade for menor que 18 anos', async () => {
    usersRepoMock.findById.mockResolvedValue({ id: 'user-id' });

    await expect(
      service.updateProfile('user-id', { birth_date: '2010-01-01' } as any),
    ).rejects.toBeInstanceOf(RpcException);
  });

  // ===========================
  // getProfile
  // ===========================

  it('remove dados sensíveis do perfil', async () => {
    usersRepoMock.findById.mockResolvedValue({
      id: 'user-id',
      password: 'secret',
      refreshTokenHash: 'hash',
      email: 'email@test.com',
    });

    const result = await service.getProfile('user-id');

    expect((result as any).password).toBeUndefined();
    expect((result as any).refreshTokenHash).toBeUndefined();
  });

  it('falha ao buscar usuário inexistente', async () => {
    usersRepoMock.findById.mockResolvedValue(null);

    await expect(service.getProfile('user-id')).rejects.toBeInstanceOf(
      RpcException,
    );
  });

  // ===========================
  // Favoritos
  // ===========================

  it('adiciona favorito com sucesso', async () => {
    favoritesRepoMock.add.mockResolvedValue(undefined);

    const result = await service.add('user-id', 'acc-id');

    expect(result).toBe('added');
  });

  it('erro 409 ao adicionar favorito duplicado', async () => {
    favoritesRepoMock.add.mockRejectedValue({ code: '23505' });

    await expect(service.add('user-id', 'acc-id')).rejects.toBeInstanceOf(
      RpcException,
    );
  });

  it('remove favorito com sucesso', async () => {
    favoritesRepoMock.remove.mockResolvedValue(undefined);

    await expect(service.remove('user-id', 'acc-id')).resolves.toBeUndefined();
  });

  it('lista favoritos', async () => {
    favoritesRepoMock.listByUser.mockResolvedValue([{ id: '1' }]);

    const result = await service.listByUser('user-id');

    expect(result).toHaveLength(1);
  });
});
