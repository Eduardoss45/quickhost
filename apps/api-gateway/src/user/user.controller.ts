import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dtos';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateProfile(
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateUserDto,
  ) {
    await this.userService.updateProfile(user.userId, dto);

    return {
      status: 200,
      message: 'Perfil atualizado com sucesso',
    };
  }
}
