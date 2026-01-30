import { mapDatabaseError } from '../../common/errors/database-error.mapper';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserRepository } from '../../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  private async generateTokens(user: {
    id: string;
    email: string;
    username: string;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
    });
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async register(data: {
    email: string;
    username: string;
    password: string;
    confirm_password: string;
    cpf: string;
    birth_date: Date;
  }) {
    const exists = await this.users.findByEmail(data.email);

    if (exists) {
      throw new RpcException({
        statusCode: 409,
        message: 'Email already in use',
      });
    }

    if (data.password !== data.confirm_password) {
      throw new RpcException({
        statusCode: 400,
        message: 'Passwords do not match',
      });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    let user;
    try {
      user = await this.users.createUser({
        email: data.email,
        username: data.username,
        password: passwordHash,
        cpf: data.cpf,
        birth_date: data.birth_date,
      });
    } catch (err) {
      mapDatabaseError(err);
    }

    const tokens = await this.generateTokens(user);

    try {
      const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
      await this.users.updateRefreshToken(user.id, refreshHash);
    } catch (err) {
      mapDatabaseError(err);
    }

    return {
      status: 'created',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      ...tokens,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.users.findByEmailWithPassword(data.email);

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const valid = await bcrypt.compare(data.password, user.password);

    if (!valid) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid credentials',
      });
    }

    const tokens = await this.generateTokens(user);

    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.users.updateRefreshToken(user.id, refreshHash);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string }>(refreshToken);
      const user = await this.users.findById(payload.sub);

      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Access denied');
      }

      const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);

      if (!valid) {
        await this.users.updateRefreshToken(user.id, null);
        throw new UnauthorizedException({
          code: 'SESSION_REVOKED',
          message: 'Sessão revogada por novo login.',
        });
      }

      const tokens = await this.generateTokens(user);
      const newRefreshHash = await bcrypt.hash(tokens.refreshToken, 10);
      await this.users.updateRefreshToken(user.id, newRefreshHash);

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        ...tokens,
      };
    } catch (err) {
      throw new UnauthorizedException({
        code: 'SESSION_REVOKED',
        message: 'Sessão revogada. Faça login novamente.',
      });
    }
  }

  async logout(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string }>(refreshToken);
      await this.users.updateRefreshToken(payload.sub, null);
      return { success: true };
    } catch {
      return { success: true };
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.users.findByEmail(email);

      if (!user) {
        return {
          success: true,
          resetToken: null,
        };
      }

      const token = uuidv4();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await this.users.setPasswordResetToken(user.id, token, expiresAt);

      return {
        success: true,
        resetToken: token,
        expiresIn: 300,
      };
    } catch (err) {
      throw new RpcException({
        statusCode: 500,
        code: 'FORGOT_PASSWORD_FAILED',
        message: 'Erro ao gerar token de redefinição de senha.',
      });
    }
  }

  async resetPassword(data: {
    token: string;
    password: string;
    confirm_password: string;
  }) {
    if (data.password !== data.confirm_password) {
      throw new RpcException({
        statusCode: 400,
        message: 'Passwords do not match',
      });
    }

    const user = await this.users.findByPasswordResetToken(data.token);

    if (!user || !user.passwordResetExpiresAt) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid or expired token',
      });
    }

    if (user.passwordResetExpiresAt < new Date()) {
      await this.users.clearPasswordResetToken(user.id);
      throw new RpcException({
        statusCode: 400,
        message: 'Token expired',
      });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    await this.users.updateProfile(user.id, {
      password: passwordHash,
    });

    await this.users.updateRefreshToken(user.id, null);
    await this.users.clearPasswordResetToken(user.id);

    return { success: true };
  }
}
