import { MessagePattern, RpcException } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { MediaService } from '../services/media.service';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('process-user-profile-image')
  async processUserProfile(data: { userId: string; rawPath: string }) {
    return this.mediaService.processUserProfileImage(data.userId);
  }

  @MessagePattern('remove-profile-image')
  async removeProfileImage(data: { userId: string; imagePath: string }) {
    return this.mediaService.removeUserProfileImage(
      data.userId,
      data.imagePath,
    );
  }

  @MessagePattern('process_accommodation_images')
  async processAccommodationImages(data: { accommodationId: string }) {
    return this.mediaService.processAccommodationImages(data.accommodationId);
  }

  @MessagePattern('remove-accommodation-images')
  async removeAccommodationImages(data: { accommodationId: string }) {
    return this.mediaService.removeAccommodationImages(data.accommodationId);
  }
}
