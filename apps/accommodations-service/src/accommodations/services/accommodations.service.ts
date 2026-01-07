import { Injectable } from '@nestjs/common';

@Injectable()
export class AcommodationsService {
  async accommodations() {
    return {
      accommodations: [],
    };
  }

  async register() {
    return {
      status: 'created',
      accommodation: 'acomodação criada',
    };
  }
}
