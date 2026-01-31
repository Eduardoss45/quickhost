import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateAccommodationDto } from './create-accommodation.dto';

export class UpdateAccommodationDto extends PartialType(
  CreateAccommodationDto,
) {
  @ApiPropertyOptional({
    description: 'Nome da imagem de capa (sempre image0.jpeg)',
    example: 'image0.jpeg',
  })
  @IsOptional()
  @IsString()
  coverOriginalName?: string;
}
