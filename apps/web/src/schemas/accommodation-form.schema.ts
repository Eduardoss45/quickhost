import { z } from 'zod';
import { Category, SpaceType } from '@/enums';

export const accommodationFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().max(400).optional(),

  internal_images: z.array(z.any()).min(5).max(10),
  main_cover_index: z.number().optional(),

  category: z.enum(Object.values(Category) as [Category, ...Category[]]).nullable(),
  space_type: z.enum(Object.values(SpaceType) as [SpaceType, ...SpaceType[]]).nullable(),

  price_per_night: z.number().min(0, 'Preço inválido'),
  cleaning_fee: z.number().min(0, 'Taxa de limpeza inválida'),
  discount: z.boolean().optional(),

  room_count: z.number().min(1, 'Informe o número de quartos'),
  bed_count: z.number().min(1, 'Informe o número de camas'),
  bathroom_count: z.number().min(1, 'Informe o número de banheiros'),
  guest_capacity: z.number().min(1, 'Informe a capacidade de hóspedes'),

  address: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  postal_code: z.string().optional(),
  uf: z.string().optional(),

  wifi: z.boolean().optional(),
  tv: z.boolean().optional(),
  kitchen: z.boolean().optional(),
  washing_machine: z.boolean().optional(),
  parking_included: z.boolean().optional(),
  air_conditioning: z.boolean().optional(),
  pool: z.boolean().optional(),
  jacuzzi: z.boolean().optional(),
  grill: z.boolean().optional(),
  private_gym: z.boolean().optional(),
  beach_access: z.boolean().optional(),

  smoke_detector: z.boolean().optional(),
  fire_extinguisher: z.boolean().optional(),
  first_aid_kit: z.boolean().optional(),
  outdoor_camera: z.boolean().optional(),
});

export type AccommodationFormValues = z.infer<typeof accommodationFormSchema>;
