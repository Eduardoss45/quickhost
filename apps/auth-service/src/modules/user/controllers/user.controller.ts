import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { UpdateUserProfileDto } from '../../dtos';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('update-profile')
  updateProfile(
    @Payload() data: { userId: string; dto: UpdateUserProfileDto; file?: any },
  ) {
    return this.userService.updateProfile(data.userId, data.dto, data.file);
  }

  @MessagePattern('get-profile')
  getProfile(@Payload() data: { userId: string }) {
    return this.userService.getProfile(data.userId);
  }

  @MessagePattern('remove-profile-picture')
  async removeProfilePicture(data: { userId: string }) {
    return this.userService.removeProfilePicture(data.userId);
  }
}
