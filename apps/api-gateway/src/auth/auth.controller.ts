import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import {
  AuthRegisterDto,
  AuthLoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dtos';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =========================
  // REGISTER
  // =========================
  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({ type: AuthRegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
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

  // =========================
  // LOGIN
  // =========================
  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiBody({ type: AuthLoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
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

  // =========================
  // LOGOUT
  // =========================
  @Post('logout')
  @ApiOperation({ summary: 'Logout do usuário' })
  @ApiCookieAuth('refreshToken')
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
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

  // =========================
  // REFRESH TOKEN
  // =========================
  @Post('refresh')
  @ApiOperation({ summary: 'Atualizar access token usando refresh token' })
  @ApiCookieAuth('refreshToken')
  @ApiResponse({ status: 200, description: 'Tokens atualizados com sucesso' })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido ou ausente',
  })
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

  // =========================
  // FORGOT PASSWORD
  // =========================
  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar redefinição de senha' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Token de redefinição gerado com sucesso',
  })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const result = await this.authService.forgotPasswordAuthService(body.email);

    return {
      statusCode: 200,
      message: 'Token de redefinição gerado com sucesso',
      ...result,
    };
  }

  // =========================
  // RESET PASSWORD
  // =========================
  @Post('reset-password')
  @ApiOperation({ summary: 'Redefinir senha do usuário' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.authService.resetPasswordAuthService(body);

    return {
      statusCode: 200,
      message: 'Senha alterada com sucesso',
    };
  }

  // =========================
  // PRIVATE METHODS
  // =========================
  private setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1 * 24 * 60 * 60 * 1000,
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
}
