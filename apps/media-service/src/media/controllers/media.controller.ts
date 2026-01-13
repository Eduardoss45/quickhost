import { MessagePattern, RpcException } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { MediaService } from '../services/media.service';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('upload_profile_image')
  async mediaUploadProfileImage(data: {
    fileBuffer: string;
    originalName: string;
  }) {
    console.log('📩 MediaController recebeu payload:', data);
    
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

    return await this.mediaService.uploadProfileImage(
      buffer,
      data.originalName,
    );
  }
}
