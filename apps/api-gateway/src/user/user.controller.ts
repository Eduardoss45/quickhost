import {
  Controller,
  Patch,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Get,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dtos';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/types';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('update')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  async updateProfile(
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    await this.userService.updateProfile(user.userId, dto, file);

    return {
      status: 200,
      message: 'Perfil atualizado com sucesso',
    };
  }

  @Get()
  async getProfile(@CurrentUser() user: JwtUser) {
    return this.userService.getProfile(user.userId);
  }

  @Delete('profile-picture')
  async removeProfilePicture(@CurrentUser() user: JwtUser) {
    await this.userService.removeProfilePicture(user.userId);

    return {
      status: 200,
      message: 'Foto de perfil removida com sucesso',
    };
  }
}
