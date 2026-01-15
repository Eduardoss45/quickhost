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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/types';

import { AccommodationsService } from './accommodations.service';
import { CreateAccommodationDto, UpdateAccommodationDto } from '../dtos/';
import { FilesInterceptor } from '@nestjs/platform-express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

@UseGuards(JwtAuthGuard)
@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly service: AccommodationsService) {}

  private async localUploadAccommodationImages(
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
  findAll() {
    return this.service.findAll();
  }

  @Get('my-records')
  getMyAccommodations(@CurrentUser() user: JwtUser) {
    return this.service.findMyAccommodations(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateAccommodationDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const accommodation = await this.service.create({
      ...dto,
      creator_id: user.userId,
    });

    if (files?.length) {
      if (!dto.coverOriginalName) {
        throw new BadRequestException(
          'coverOriginalName é obrigatório quando imagens são enviadas',
        );
      }

      const { cover, images } = await this.localUploadAccommodationImages(
        accommodation.id,
        files,
        dto.coverOriginalName,
      );

      return this.service.update(
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
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAccommodationDto,
    @CurrentUser() user: JwtUser,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    const { coverOriginalName, ...data } = dto;

    let images: string[] | undefined;
    let cover: string | undefined;

    if (files?.length) {
      const result = await this.localUploadAccommodationImages(
        id,
        files,
        coverOriginalName!,
      );

      images = result.images;
      cover = result.cover;
    }

    return this.service.update(
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
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
