import { z } from 'zod';
import { Category, SpaceType } from '@/enums';

export const accommodationFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().max(400).optional(),

  internal_images: z.array(z.any()).min(5).max(10),
  main_cover_index: z.number().optional(),

  images_replaced: z.boolean(),

  category: z.enum(Object.values(Category) as [Category, ...Category[]]).nullable(),
  space_type: z.enum(Object.values(SpaceType) as [SpaceType, ...SpaceType[]]).nullable(),

  price_per_night: z.number().min(0),
  cleaning_fee: z.number().min(0),
  discount: z.boolean(),

  room_count: z.number().min(1),
  bed_count: z.number().min(1),
  bathroom_count: z.number().min(1),
  guest_capacity: z.number().min(1),

  address: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  postal_code: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  uf: z
    .string()
    .trim()
    .length(2, 'UF deve conter exatamente 2 letras')
    .regex(/^[A-Za-z]{2}$/, 'UF deve conter apenas letras')
    .transform(val => val.toUpperCase()),

  wifi: z.boolean(),
  tv: z.boolean(),
  kitchen: z.boolean(),
  washing_machine: z.boolean(),
  parking_included: z.boolean(),
  air_conditioning: z.boolean(),
  pool: z.boolean(),
  jacuzzi: z.boolean(),
  grill: z.boolean(),
  private_gym: z.boolean(),
  beach_access: z.boolean(),

  smoke_detector: z.boolean(),
  fire_extinguisher: z.boolean(),
  first_aid_kit: z.boolean(),
  outdoor_camera: z.boolean(),
});

export type AccommodationFormValues = z.infer<typeof accommodationFormSchema>;
