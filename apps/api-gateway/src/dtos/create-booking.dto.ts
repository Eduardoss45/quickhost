import { IsUUID, IsISO8601 } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  accommodationId: string;

  @IsUUID()
  hostId: string;

  @IsISO8601()
  checkInDate: string;

  @IsISO8601()
  checkOutDate: string;
}
