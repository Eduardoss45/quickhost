import { Injectable } from '@nestjs/common';

@Injectable()
export class AcommodationsService {
  async register() {
    return {
      status: 'created',
      accommodation: 'acomodação criada',
    };
  }
}
