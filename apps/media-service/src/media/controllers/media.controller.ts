import { MessagePattern, RpcException } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { MediaService } from '../services/media.service';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('upload-profile-image')
  async mediaUploadProfileImage(data: {
    userId: string;
    fileBuffer: string;
    originalName: string;
  }) {
    if (!data.fileBuffer || typeof data.fileBuffer !== 'string') {
      throw new RpcException({
        statusCode: 400,
        message: 'Arquivo inválido ou ausente',
      });
    }

    const buffer = Buffer.from(data.fileBuffer, 'base64');

    if (!buffer || buffer.length < 10) {
      throw new RpcException({
        statusCode: 400,
        message: 'Arquivo inválido ou corrompido',
      });
    }

    if (!data.originalName) {
      throw new RpcException({
        statusCode: 400,
        message: 'Nome do arquivo ausente',
      });
    }

    return await this.mediaService.uploadUserProfileImage(
      data.userId,
      buffer,
      data.originalName,
    );
  }

  @MessagePattern('remove-profile-image')
  async removeProfileImage(data: { userId: string; imagePath: string }) {
    return this.mediaService.removeUserProfileImage(
      data.userId,
      data.imagePath,
    );
  }

  @MessagePattern('upload-accommodation-images')
  async uploadAccommodationImages(data: {
    accommodationId: string;
    images: {
      fileBuffer: Buffer;
      originalName: string;
    }[];
    coverOriginalName: string;
  }) {
    if (!data.images || !Array.isArray(data.images)) {
      throw new RpcException({
        statusCode: 400,
        message: 'Imagens inválidas',
      });
    }

    if (data.images.length > 10) {
      throw new RpcException({
        statusCode: 400,
        message: 'Máximo de 10 imagens por acomodação',
      });
    }

    return this.mediaService.uploadAccommodationImages(
      data.accommodationId,
      data.images,
      data.coverOriginalName,
    );
  }

  @MessagePattern('remove-accommodation-images')
  async removeAccommodationImages(data: { accommodationId: string }) {
    return this.mediaService.removeAccommodationImages(data.accommodationId);
  }
}
