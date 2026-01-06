import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './accommodations.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  registerAuthController(@Body() data: {}) {
    return this.authService.registerAccommodationsService();
  }
}
