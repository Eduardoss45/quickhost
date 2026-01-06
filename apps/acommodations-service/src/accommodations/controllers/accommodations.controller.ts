import { Controller } from '@nestjs/common';
import { AcommodationsService } from '../services/accommodations.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly authService: AcommodationsService) {}
  @MessagePattern('register')
  async authRegister(@Payload() data: any) {
    return this.authService.register();
  }
}
