import { AccommodationFormValues } from '@/schemas/accommodation-form.schema';
import { Accommodation } from '@/types';

export function accommodationToForm(accommodation: Accommodation): AccommodationFormValues {
  return {
    title: accommodation.title,
    description: accommodation.description ?? '',

    category: accommodation.category,
    space_type: accommodation.space_type,

    price_per_night: Number(accommodation.price_per_night),
    cleaning_fee: Number(accommodation.cleaning_fee),
    discount: accommodation.discount ?? false,

    room_count: accommodation.room_count,
    bed_count: accommodation.bed_count,
    bathroom_count: accommodation.bathroom_count,
    guest_capacity: accommodation.guest_capacity,

    address: accommodation.address ?? '',
    city: accommodation.city ?? '',
    neighborhood: accommodation.neighborhood ?? '',
    postal_code: accommodation.postal_code ?? '',
    uf: accommodation.uf ?? '',

    wifi: accommodation.wifi,
    tv: accommodation.tv,
    kitchen: accommodation.kitchen,
    washing_machine: accommodation.washing_machine,
    parking_included: accommodation.parking_included,
    air_conditioning: accommodation.air_conditioning,
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

    images_replaced: false,
    main_cover_index: undefined,
  };
}
