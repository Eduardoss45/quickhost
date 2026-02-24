import { LocalImageStorageService } from 'src/storage/local-image-storage.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/types';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

import { AccommodationService } from './accommodation.service';
import {
  CreateAccommodationDto,
  UpdateAccommodationDto,
  CreateCommentDto,
} from '../dtos';
import { CreateAccommodationCommand } from '../commands';

@ApiTags('Accommodations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accommodations')
export class AccommodationController {
  constructor(
    private readonly accommodationService: AccommodationService,
    private readonly imageStorage: LocalImageStorageService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as acomodações' })
  findAllAccommodations() {
    return this.accommodationService.findAllAccommodations();
  }

  @Get('my-records')
  @ApiOperation({ summary: 'Listar acomodações do usuário autenticado' })
  getMyAccommodations(@CurrentUser() user: JwtUser) {
    return this.accommodationService.findMyAccommodations(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar acomodação por ID' })
  findOneAccommodation(@Param('id') id: string) {
    return this.accommodationService.findOneAccommodation(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar nova acomodação' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAccommodationDto })
  @UseInterceptors(FilesInterceptor('images', 5))
  async createAccommodation(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateAccommodationDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const command: CreateAccommodationCommand = {
      ...dto,
      creator_id: user.userId,
    };

    const accommodation =
      await this.accommodationService.createAccommodation(command);

    if (!files?.length) {
      return accommodation;
    }

    if (!dto.coverOriginalName) {
      throw new BadRequestException(
        'coverOriginalName é obrigatório quando imagens são enviadas',
      );
    }

    const rawImages = await this.imageStorage.saveRawAccommodationImages(
      accommodation.id,
      files,
      dto.coverOriginalName,
    );

    return this.accommodationService.updateAccommodation(
      accommodation.id,
      {
        main_cover_image: rawImages.cover,
        internal_images: rawImages.images,
      },
      user.userId,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar acomodação' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAccommodationDto })
  @UseInterceptors(FilesInterceptor('images', 10))
  async updateAccommodation(
    @Param('id') id: string,
    @Body() dto: UpdateAccommodationDto,
    @CurrentUser() user: JwtUser,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const { coverOriginalName, ...data } = dto;

    if (!files?.length) {
      return this.accommodationService.updateAccommodation(
        id,
        data,
        user.userId,
      );
    }

    if (!coverOriginalName) {
      throw new BadRequestException(
        'coverOriginalName é obrigatório quando imagens são enviadas',
      );
    }

    const rawImages = await this.imageStorage.saveRawAccommodationImages(
      id,
      files,
      coverOriginalName,
    );

    return this.accommodationService.updateAccommodation(
      id,
      {
        ...data,
        main_cover_image: rawImages.cover,
        internal_images: rawImages.images,
      },
      user.userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover acomodação' })
  @ApiResponse({
    status: 200,
    description: 'Acomodação removida com sucesso',
  })
  async removeAccommodation(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
  ) {
    await this.accommodationService.removeAccommodation(id, user.userId);
    return { success: true };
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Criar comentário em uma acomodação' })
  @ApiBody({ type: CreateCommentDto })
  async createCommentInAccommodation(
    @Param('id') accommodationId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.accommodationService.createCommentInAccommodation({
      accommodationId,
      content: dto.content,
      rating: dto.rating,
      authorId: user.userId,
      authorName: user.username,
    });
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Listar comentários da acomodação' })
  async getCommentsInAccommodation(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return this.accommodationService.getCommentsInAccommodation(id, page, size);
  }

  @Delete(':id/images')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover imagens da acomodação' })
  async removeAccommodationImages(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
  ) {
    await this.accommodationService.removeAccommodationImages(id, user.userId);
  }
}
