import { IsUUID, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID da acomodação que será reservada',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  accommodationId: string;

  @ApiProperty({
    description: 'ID do anfitrião (dono da acomodação)',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @IsUUID()
  hostId: string;

  @ApiProperty({
    description: 'Data de check-in no formato ISO 8601',
    example: '2026-02-10',
    format: 'date',
  })
  @IsISO8601()
  checkInDate: string;

  @ApiProperty({
    description: 'Data de check-out no formato ISO 8601',
    example: '2026-02-15',
    format: 'date',
  })
  @IsISO8601()
  checkOutDate: string;
}
