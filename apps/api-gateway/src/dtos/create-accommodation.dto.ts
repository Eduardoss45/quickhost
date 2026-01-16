import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';

import { Category, SpaceType } from '../enums';

import { Transform } from 'class-transformer';

export class CreateAccommodationDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  main_cover_image?: string;

  @IsOptional()
  @IsArray()
  internal_images?: string[];

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_active?: boolean;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(50_000)
  price_per_night?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(5_000)
  cleaning_fee?: number;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  @IsBoolean()
  discount?: boolean;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  room_count?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  bed_count?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  bathroom_count?: number;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  guest_capacity?: number;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsEnum(SpaceType)
  space_type?: SpaceType;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  postal_code?: string;

  @IsOptional()
  @IsString()
  uf?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  wifi?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  tv?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  kitchen?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  washing_machine?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  parking_included?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  air_conditioning?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  pool?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  jacuzzi?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  grill?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  private_gym?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  beach_access?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  smoke_detector?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  fire_extinguisher?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  first_aid_kit?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  outdoor_camera?: boolean;

  @IsOptional()
  @IsString()
  coverOriginalName?: string;
}
