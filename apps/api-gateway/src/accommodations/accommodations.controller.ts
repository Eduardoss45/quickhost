import { Controller, Get, Post } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';

@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationService: AccommodationsService) {}

  @Get()
  getAccommodationsController() {
    return this.accommodationService.getAccommodationsService();
  }

  @Post('register')
  registerAccommodationsController() {
    return this.accommodationService.registerAccommodationsService();
  }
}
