import {
  Controller,
  Patch,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Get,
  Delete,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dtos';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalImageStorageService } from '../storage/local-image-storage.service';
import multer from 'multer';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly imageStorage: LocalImageStorageService,
  ) {}

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
    if (file) {
      await this.imageStorage.saveRawUserProfileImage(user.userId, file);
    }

    await this.userService.updateProfile(user.userId, dto);

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

  @Get('favorites')
  async list(@CurrentUser() user: JwtUser) {
    const favorites = await this.userService.listByUser(user.userId);
    return favorites.map(
      (f: { accommodation_id: string }) => f.accommodation_id,
    );
  }

  @Delete('favorites/:accommodationId')
  async removeFavorite(
    @CurrentUser() user: JwtUser,
    @Param('accommodationId') accommodationId: string,
  ) {
    await this.userService.remove(user.userId, accommodationId);

    return {
      status: 200,
      message: 'Removido dos favoritos',
      accommodationId,
    };
  }

  @Get('/:userId')
  getPublicUser(@Param('userId') userId: string) {
    return this.userService.getPublicUser(userId);
  }

  @Post('favorites/:accommodationId')
  async addFavorite(
    @CurrentUser() user: JwtUser,
    @Param('accommodationId') accommodationId: string,
  ) {
    const result = await this.userService.add(user.userId, accommodationId);

    return {
      favorited: result === 'added',
    };
  }
}
