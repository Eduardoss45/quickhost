import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserRepository } from '../../../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let users: jest.Mocked<UserRepository>;
  let jwt: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            findByEmailWithPassword: jest.fn(),
            createUser: jest.fn(),
            updateRefreshToken: jest.fn(),
            findById: jest.fn(),
            setPasswordResetToken: jest.fn(),
            findByPasswordResetToken: jest.fn(),
            clearPasswordResetToken: jest.fn(),
            updateProfile: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    users = module.get(UserRepository);
    jwt = module.get(JwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registra usuário com sucesso', async () => {
    users.findByEmail.mockResolvedValue(null as any);
    users.createUser.mockResolvedValue({
      id: 'user-id',
      email: 'user@email.com',
      username: 'user',
    } as any);

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    (jwt.sign as jest.Mock)
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const result = await service.register({
      email: 'user@email.com',
      username: 'user',
      password: '123456',
      confirm_password: '123456',
      cpf: '00000000000',
      birth_date: new Date(),
    });

    expect(result.status).toBe('created');
    expect(result.accessToken).toBe('access-token');
    expect(users.updateRefreshToken).toHaveBeenCalled();
  });

  it('falha se email já existir', async () => {
    users.findByEmail.mockResolvedValue({ id: '1' } as any);

    await expect(
      service.register({
        email: 'user@email.com',
        username: 'user',
        password: '123',
        confirm_password: '123',
        cpf: '000',
        birth_date: new Date(),
      }),
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('falha se senhas não coincidirem no register', async () => {
    users.findByEmail.mockResolvedValue(null as any);

    await expect(
      service.register({
        email: 'user@email.com',
        username: 'user',
        password: '123',
        confirm_password: '456',
        cpf: '000',
        birth_date: new Date(),
      }),
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('autentica usuário com sucesso', async () => {
    users.findByEmailWithPassword.mockResolvedValue({
      id: 'user-id',
      email: 'user@email.com',
      username: 'user',
      password: 'hashed',
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('refresh-hash');

    (jwt.sign as jest.Mock)
      .mockReturnValueOnce('access')
      .mockReturnValueOnce('refresh');

    const result = await service.login({
      email: 'user@email.com',
      password: '123456',
    });

    expect(result.accessToken).toBe('access');
    expect(users.updateRefreshToken).toHaveBeenCalled();
  });

  it('falha no login com senha inválida', async () => {
    users.findByEmailWithPassword.mockResolvedValue({
      id: 'user-id',
      password: 'hashed',
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: 'user@email.com', password: 'wrong' }),
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('renova tokens com refresh válido', async () => {
    jwt.verify.mockReturnValue({ sub: 'user-id' } as any);

    users.findById.mockResolvedValue({
      id: 'user-id',
      email: 'user@email.com',
      username: 'user',
      refreshTokenHash: 'hash',
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');

    (jwt.sign as jest.Mock)
      .mockReturnValueOnce('new-access')
      .mockReturnValueOnce('new-refresh');

    const result = await service.refresh('refresh-token');

    expect(result.accessToken).toBe('new-access');
    expect(users.updateRefreshToken).toHaveBeenCalled();
  });

  it('revoga sessão se refresh token for inválido', async () => {
    jwt.verify.mockReturnValue({ sub: 'user-id' } as any);

    users.findById.mockResolvedValue({
      id: 'user-id',
      refreshTokenHash: 'hash',
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.refresh('invalid')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('faz logout com refresh válido', async () => {
    jwt.verify.mockReturnValue({ sub: 'user-id' } as any);

    const result = await service.logout('refresh');

    expect(users.updateRefreshToken).toHaveBeenCalledWith('user-id', null);
    expect(result).toEqual({ success: true });
  });

  it('não falha no logout com refresh inválido', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error();
    });

    const result = await service.logout('invalid');

    expect(result).toEqual({ success: true });
  });

  it('gera token de recuperação de senha', async () => {
    users.findByEmail.mockResolvedValue({ id: 'user-id' } as any);
    (uuidv4 as jest.Mock).mockReturnValue('reset-token');

    const result = await service.forgotPassword('user@email.com');

    expect(result.resetToken).toBe('reset-token');
    expect(users.setPasswordResetToken).toHaveBeenCalled();
  });

  it('reseta senha com token válido', async () => {
    users.findByPasswordResetToken.mockResolvedValue({
      id: 'user-id',
      passwordResetExpiresAt: new Date(Date.now() + 10000),
    } as any);

    (bcrypt.hash as jest.Mock).mockResolvedValue('new-password');

    const result = await service.resetPassword({
      token: 'token',
      password: '123',
      confirm_password: '123',
    });

    expect(result).toEqual({ success: true });
    expect(users.updateProfile).toHaveBeenCalled();
    expect(users.clearPasswordResetToken).toHaveBeenCalled();
  });

  it('falha ao resetar senha com token expirado', async () => {
    users.findByPasswordResetToken.mockResolvedValue({
      id: 'user-id',
      passwordResetExpiresAt: new Date(Date.now() - 1000),
    } as any);

    await expect(
      service.resetPassword({
        token: 'token',
        password: '123',
        confirm_password: '123',
      }),
    ).rejects.toBeInstanceOf(RpcException);
  });
});
