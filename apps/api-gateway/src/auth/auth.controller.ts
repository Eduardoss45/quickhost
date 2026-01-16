import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthRegisterDto, AuthLoginDto } from '../dtos';
import { UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth/refresh',
    });
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
    });
  }

  @Post('register')
  async register(
    @Body() dto: AuthRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.registerAuthService(dto);

    this.setAuthCookies(res, result);

    return {
      status: 201,
      message: 'Usuário registrado com sucesso',
      user: result.user,
    };
  }

  @Post('login')
  async login(
    @Body() dto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.loginAuthService(dto);

    this.setAuthCookies(res, result);

    return {
      status: 200,
      message: 'Login realizado com sucesso',
      user: result.user,
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await this.authService.logoutAuthService(refreshToken);
    }

    this.clearAuthCookies(res);

    return {
      status: 200,
      message: 'Logout realizado com sucesso',
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    try {
      const result = await this.authService.refreshAuthService(refreshToken);
      this.setAuthCookies(res, result);
      return {
        status: 200,
        message: 'Tokens atualizados com sucesso',
        user: result.user,
      };
    } catch (err) {
      this.clearAuthCookies(res);
      throw err;
    }
  }

  @Post('forgot-password')
  async forgotPassword() {
    return {
      status: 200,
      message: 'Instruções enviadas para o e-mail do usuário',
    };
  }

  @Post('reset-password')
  async resetPassword() {
    return {
      status: 200,
      message: 'Senha alterada com sucesso',
    };
  }
}
