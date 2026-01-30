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
  BadRequestException,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/types';

import { AccommodationService } from './accommodation.service';
import {
  CreateAccommodationDto,
  UpdateAccommodationDto,
  CreateCommentDto,
} from '../dtos';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  CreateAccommodationCommand,
  UpdateAccommodationCommand,
  CreateCommentCommand,
} from 'src/commands';
import { LocalImageStorageService } from 'src/storage/local-image-storage.service';

@UseGuards(JwtAuthGuard)
@Controller('accommodations')
export class AccommodationController {
  constructor(
    private readonly accommodationService: AccommodationService,
    private readonly imageStorage: LocalImageStorageService,
  ) {}

  @Get()
  findAllAccommodations() {
    return this.accommodationService.findAllAccommodations();
  }

  @Get('my-records')
  getMyAccommodations(@CurrentUser() user: JwtUser) {
    return this.accommodationService.findMyAccommodations(user.userId);
  }

  @Get(':id')
  findOneAccommodation(@Param('id') id: string) {
    return this.accommodationService.findOneAccommodation(id);
  }

  @Post()
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

    if (files?.length) {
      if (!dto.coverOriginalName) {
        throw new BadRequestException(
          'coverOriginalName é obrigatório quando imagens são enviadas',
        );
      }

      const { cover, images } =
        await this.imageStorage.saveRawAccommodationImages(
          accommodation.id,
          files,
          dto.coverOriginalName,
        );

      return this.accommodationService.updateAccommodation(
        accommodation.id,
        {
          main_cover_image: cover,
          internal_images: images,
        },
        user.userId,
      );
    }
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  async updateAccommodation(
    @Param('id') id: string,
    @Body() dto: UpdateAccommodationDto,
    @CurrentUser() user: JwtUser,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const { coverOriginalName, ...data } = dto;

    const command: UpdateAccommodationCommand = {
      id,
      data: { ...data },
      creatorId: user.userId,
    };

    if (files?.length) {
      if (!coverOriginalName) {
        throw new BadRequestException(
          'coverOriginalName é obrigatório quando imagens são enviadas',
        );
      }

      const { cover, images } =
        await this.imageStorage.saveRawAccommodationImages(
          id,
          files,
          coverOriginalName,
        );

      command.data = {
        ...command.data,
        main_cover_image: cover,
        internal_images: images,
      };
    }

    return this.accommodationService.updateAccommodation(
      command.id,
      command.data,
      command.creatorId,
    );
  }

  @Delete(':id')
  async removeAccommodation(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
  ) {
    await this.accommodationService.removeAccommodation(id, user.userId);
    return { success: true };
  }

  @Post(':id/comments')
  async createCommentInAccommodation(
    @Param('id') accommodationId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: JwtUser,
  ) {
    const command: CreateCommentCommand = {
      accommodationId: accommodationId,
      content: dto.content,
      rating: dto.rating,
      authorId: user.userId,
      authorName: user.username,
    };
    return this.accommodationService.createCommentInAccommodation(command);
  }

  @Get(':id/comments')
  async getCommentsInAccommodation(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return this.accommodationService.getCommentsInAccommodation(id, page, size);
  }

  @Delete(':id/images')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAccommodationImages(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
  ) {
    await this.accommodationService.removeAccommodationImages(id, user.userId);
  }
}
