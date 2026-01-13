import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../../dtos';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('update-profile')
  updateProfile(
    @Payload() data: { userId: string; dto: UpdateUserDto; file?: any },
  ) {
    return this.userService.updateProfile(data.userId, data.dto, data.file);
  }
}
