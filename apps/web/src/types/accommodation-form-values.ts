import { Category, SpaceType } from '@/enums';
import { AccommodationImage } from './accommodation-images';

export type AccommodationFormValues = {
  title: string;
  description: string;

  category: Category | null;
  space_type: SpaceType | null;

  price_per_night: number;
  cleaning_fee: number;

  room_count: number;
  bed_count: number;
  bathroom_count: number;
  guest_capacity: number;

  address: string;
  city: string;
  neighborhood?: string;
  postal_code: string;
  uf: string;

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

  internal_images: AccommodationImage;
  main_cover_image?: string;

  images_replaced: boolean;
  main_cover_index?: number;
};
