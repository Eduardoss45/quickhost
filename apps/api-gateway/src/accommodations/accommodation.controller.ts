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
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { CreateAccommodationCommand } from 'src/commands';

@UseGuards(JwtAuthGuard)
@Controller('accommodations')
export class AccommodationController {
  constructor(private readonly accommodationService: AccommodationService) {}

  private async uploadAccommodationImages(
    accommodationId: string,
    files: Express.Multer.File[],
    coverOriginalName: string,
  ) {
    const coverIndex = files.findIndex(
      (f) => f.originalname === coverOriginalName,
    );

    if (coverIndex === -1) {
      throw new BadRequestException('Imagem de capa não encontrada');
    }

    const ordered = [
      files[coverIndex],
      ...files.filter((_, i) => i !== coverIndex),
    ];

    const dir = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'uploads',
      'accommodations',
      accommodationId,
    );

    await fs.promises.mkdir(dir, { recursive: true });

    const images: string[] = [];

    for (let i = 0; i < ordered.length; i++) {
      const buffer = await sharp(ordered[i].buffer)
        .resize({ width: 1200 })
        .jpeg({ quality: 90 })
        .toBuffer();

      const filename = `image${i}.jpeg`;
      await fs.promises.writeFile(path.join(dir, filename), buffer);

      images.push(`/uploads/accommodations/${accommodationId}/${filename}`);
    }

    return {
      cover: images[0],
      images,
    };
  }

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
  @UseInterceptors(FilesInterceptor('images', 10))
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

      const { cover, images } = await this.uploadAccommodationImages(
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

    let images: string[] | undefined;
    let cover: string | undefined;

    if (files?.length) {
      const result = await this.uploadAccommodationImages(
        id,
        files,
        coverOriginalName!,
      );

      images = result.images;
      cover = result.cover;
    }

    return this.accommodationService.updateAccommodation(
      id,
      {
        ...data,
        internal_images: images,
        main_cover_image: cover,
      },
      user.userId,
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
    @Req() req: any,
  ) {
    return this.accommodationService.createCommentInAccommodation({
      accommodationId: accommodationId,
      content: dto.content,
      rating: dto.rating,
      authorId: req.user.userId,
      authorName: req.user.username,
    });
  }

  @Get(':id/comments')
  async getCommentsInAccommodation(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    return this.accommodationService.getCommentsInAccommodation(id, page, size);
  }
}
