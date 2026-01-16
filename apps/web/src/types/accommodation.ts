import { AccommodationFormValues } from '@/schemas/accommodation-form.schema';
import { Category, SpaceType } from '@/enums';

export interface Accommodation {
  id: string;
  title: string;
  description?: string;
  creator_id: string;

  main_cover_image?: string;
  internal_images: (File | { url: string })[];

  is_active: boolean;

  price_per_night: string;
  cleaning_fee: string;
  discount: boolean;

  average_rating: string;

  room_count: number;
  bed_count: number;
  bathroom_count: number;
  guest_capacity: number;

  category: Category | null;
  space_type: SpaceType | null;

  address?: string;
  city?: string;
  neighborhood?: string;
  postal_code?: string;
  uf?: string;

  wifi: boolean;
  tv: boolean;
  kitchen: boolean;
  washing_machine: boolean;
  parking_included: boolean;
  air_conditioning: boolean;
  pool: boolean;
  jacuzzi: boolean;
  grill: boolean;
  private_gym: boolean;
  beach_access: boolean;

  smoke_detector: boolean;
  fire_extinguisher: boolean;
  first_aid_kit: boolean;
  outdoor_camera: boolean;

  created_at: string;
  updated_at: string;
}

export type CreateAccommodationPayload = {
  title: string;
  description?: string;

  price_per_night: number;
  cleaning_fee: number;

  room_count: number;
  bed_count: number;
  bathroom_count: number;
  guest_capacity: number;

  category: Category;
  space_type: SpaceType;

  address?: string;
  city?: string;
  neighborhood?: string;
  postal_code?: string;
  uf?: string;

  wifi?: boolean;
  tv?: boolean;
  kitchen?: boolean;
  air_conditioning?: boolean;
  parking_included?: boolean;
  pool?: boolean;
  jacuzzi?: boolean;
  grill?: boolean;
  private_gym?: boolean;
  beach_access?: boolean;

  smoke_detector?: boolean;
  fire_extinguisher?: boolean;
  first_aid_kit?: boolean;
  outdoor_camera?: boolean;

  internal_images?: string[];
  main_cover_image?: string;
};

export type UpdateAccommodationPayload = Partial<CreateAccommodationPayload>;

export type ResourceKey = keyof Pick<
  AccommodationFormValues,
  | 'wifi'
  | 'tv'
  | 'kitchen'
  | 'washing_machine'
  | 'parking_included'
  | 'air_conditioning'
  | 'pool'
  | 'jacuzzi'
  | 'grill'
  | 'private_gym'
  | 'beach_access'
  | 'smoke_detector'
  | 'fire_extinguisher'
  | 'first_aid_kit'
  | 'outdoor_camera'
>;
