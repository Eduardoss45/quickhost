import { IsUUID } from 'class-validator';

export class ConfirmBookingDto {
  @IsUUID()
  bookingId: string;
}
