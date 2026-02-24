import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsArray,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category, SpaceType } from '../enums';

const toBoolean = ({ value }: { value: unknown }) => {
  if (value === true || value === false) return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

export class CreateAccommodationDto {
  @ApiProperty({ example: 'Apartamento moderno no centro' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Apartamento bem localizado, próximo a tudo.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Imagem principal já persistida (gerada após upload)',
    example: '/uploads/accommodations/<uuid>/image0.jpeg',
  })
  @IsOptional()
  @IsString()
  main_cover_image?: string;

  @ApiPropertyOptional({
    description: 'Imagens internas do imóvel',
    type: [String],
    example: [
      '/uploads/accommodations/<uuid>/image1.jpeg',
      '/uploads/accommodations/<uuid>/image2.jpeg',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  internal_images?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ example: 300, minimum: 100, maximum: 50000 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(100)
  @Max(50_000)
  price_per_night?: number;

  @ApiPropertyOptional({ example: 150, minimum: 50, maximum: 5000 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(50)
  @Max(5_000)
  cleaning_fee?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  discount?: boolean;

  @ApiPropertyOptional({ example: 2, minimum: 1, maximum: 15 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @Max(15)
  room_count?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  bed_count?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  bathroom_count?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  guest_capacity?: number;

  @ApiPropertyOptional({ enum: Category, example: Category.APARTMENT })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiPropertyOptional({ enum: SpaceType, example: SpaceType.FULL_SPACE })
  @IsOptional()
  @IsEnum(SpaceType)
  space_type?: SpaceType;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'São Paulo' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Centro' })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiPropertyOptional({ example: '01000-000' })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiPropertyOptional({ example: 'SP', minLength: 2, maxLength: 2 })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  uf?: string;

  // Amenities
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  wifi?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  tv?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  kitchen?: boolean;
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  washing_machine?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  parking_included?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  air_conditioning?: boolean;
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  pool?: boolean;
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  jacuzzi?: boolean;
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  grill?: boolean;
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  private_gym?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  beach_access?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  smoke_detector?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  fire_extinguisher?: boolean;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  first_aid_kit?: boolean;
  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  outdoor_camera?: boolean;

  @ApiPropertyOptional({
    description: 'Nome original da imagem de capa (sempre image0.jpeg)',
    example: 'image0.jpeg',
  })
  @IsOptional()
  @IsString()
  coverOriginalName?: string;
}
