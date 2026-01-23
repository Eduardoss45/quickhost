import { IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateAccommodationDto } from './create-accommodation';

export class UpdateAccommodationDto extends PartialType(
  CreateAccommodationDto,
) {
  @IsOptional()
  @IsString()
  coverOriginalName?: string;
}
