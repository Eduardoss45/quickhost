import { Accommodation, CreateAccommodationPayload } from '@/types';

export function accommodationToForm(accommodation: Accommodation): CreateAccommodationPayload {
  return {
    title: accommodation.title,
    description: accommodation.description ?? '',

    price_per_night: Number(accommodation.price_per_night),
    cleaning_fee: Number(accommodation.cleaning_fee),

    room_count: accommodation.room_count,
    bed_count: accommodation.bed_count,
    bathroom_count: accommodation.bathroom_count,
    guest_capacity: accommodation.guest_capacity,

    category: accommodation.category,
    space_type: accommodation.space_type,

    ...(accommodation.address && { address: accommodation.address }),
    ...(accommodation.city && { city: accommodation.city }),
    ...(accommodation.neighborhood && {
      neighborhood: accommodation.neighborhood,
    }),
    ...(accommodation.postal_code && {
      postal_code: accommodation.postal_code,
    }),
    ...(accommodation.uf && { uf: accommodation.uf }),

    wifi: accommodation.wifi,
    tv: accommodation.tv,
    kitchen: accommodation.kitchen,
    air_conditioning: accommodation.air_conditioning,
    parking_included: accommodation.parking_included,
    pool: accommodation.pool,
    jacuzzi: accommodation.jacuzzi,
    grill: accommodation.grill,
    private_gym: accommodation.private_gym,
    beach_access: accommodation.beach_access,

    smoke_detector: accommodation.smoke_detector,
    fire_extinguisher: accommodation.fire_extinguisher,
    first_aid_kit: accommodation.first_aid_kit,
    outdoor_camera: accommodation.outdoor_camera,

    internal_images: accommodation.internal_images,
    ...(accommodation.main_cover_image && {
      main_cover_image: accommodation.main_cover_image,
    }),
  };
}
