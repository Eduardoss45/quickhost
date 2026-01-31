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
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dtos';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalImageStorageService } from '../storage/local-image-storage.service';
import multer from 'multer';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly imageStorage: LocalImageStorageService,
  ) {}

  @Patch('update')
  @ApiOperation({ summary: 'Atualizar perfil do usuário autenticado' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso',
  })
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
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário',
  })
  async getProfile(@CurrentUser() user: JwtUser) {
    return this.userService.getProfile(user.userId);
  }

  @Delete('profile-picture')
  @ApiOperation({ summary: 'Remover foto de perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Foto de perfil removida com sucesso',
  })
  async removeProfilePicture(@CurrentUser() user: JwtUser) {
    await this.userService.removeProfilePicture(user.userId);

    return {
      status: 200,
      message: 'Foto de perfil removida com sucesso',
    };
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Listar acomodações favoritadas pelo usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de IDs das acomodações favoritas',
  })
  async list(@CurrentUser() user: JwtUser) {
    const favorites = await this.userService.listByUser(user.userId);
    return favorites.map(
      (f: { accommodation_id: string }) => f.accommodation_id,
    );
  }

  @Post('favorites/:accommodationId')
  @ApiOperation({ summary: 'Adicionar acomodação aos favoritos' })
  @ApiParam({
    name: 'accommodationId',
    description: 'ID da acomodação',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Acomodação adicionada ou já favoritada',
  })
  async addFavorite(
    @CurrentUser() user: JwtUser,
    @Param('accommodationId') accommodationId: string,
  ) {
    const result = await this.userService.add(user.userId, accommodationId);

    return {
      favorited: result === 'added',
    };
  }

  @Delete('favorites/:accommodationId')
  @ApiOperation({ summary: 'Remover acomodação dos favoritos' })
  @ApiParam({
    name: 'accommodationId',
    description: 'ID da acomodação',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Acomodação removida dos favoritos',
  })
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

  @Get(':userId')
  @ApiOperation({ summary: 'Obter perfil público de um usuário' })
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil público do usuário',
  })
  getPublicUser(@Param('userId') userId: string) {
    return this.userService.getPublicUser(userId);
  }
}
