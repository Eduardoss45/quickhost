import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { UpdateUserProfileDto } from '../../dtos';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('update-profile')
  updateProfile(
    @Payload() data: { userId: string; dto: UpdateUserProfileDto },
  ) {
    return this.userService.updateProfile(data.userId, data.dto);
  }

  @MessagePattern('get-profile')
  getProfile(@Payload() data: { userId: string }) {
    return this.userService.getProfile(data.userId);
  }

  @MessagePattern('remove-profile-picture')
  async removeProfilePicture(data: { userId: string }) {
    return this.userService.removeProfilePicture(data.userId);
  }

  @MessagePattern('user.get_public_profile')
  getPublicProfile(data: { userId: string }) {
    return this.userService.getPublicUser(data.userId);
  }

  @MessagePattern('favorites.add')
  add(@Payload() data: { userId: string; accommodationId: string }) {
    return this.userService.add(data.userId, data.accommodationId);
  }

  @MessagePattern('favorites.remove')
  async remove(@Payload() data: { userId: string; accommodationId: string }) {
    await this.userService.remove(data.userId, data.accommodationId);

    return {
      success: true,
      accommodationId: data.accommodationId,
      message: 'Removido dos favoritos',
    };
  }

  @MessagePattern('favorites.list_by_user')
  list(@Payload() data: { userId: string }) {
    return this.userService.listByUser(data.userId);
  }
}
