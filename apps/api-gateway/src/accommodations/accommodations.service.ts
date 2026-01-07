import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AccommodationsService {
  constructor(
    @Inject('ACCOMMODATIONS_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  getAccommodationsService () {
    return firstValueFrom(this.client.send('accommodations', {}))
  }

  registerAccommodationsService() {
    return firstValueFrom(this.client.send('register', {}));
  }
}
