import { Controller, Post } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';

@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationService: AccommodationsService) {}
  @Post('register')
  registerAccommodationsController() {
    return this.accommodationService.registerAccommodationsService();
  }
}
