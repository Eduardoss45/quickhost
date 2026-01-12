import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dtos';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.update-profile')
  updateProfile(
    @Payload()
    data: {
      userId: string;
      dto: UpdateUserDto;
    },
  ) {
    return this.userService.updateProfile(data.userId, data.dto);
  }
}
