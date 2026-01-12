import { z } from 'zod';

export const configurationsSchema = z.object({
  username: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().length(14),
  birth_date: z.string(),
  social_name: z.string().optional(),
  email: z.email(),
  phone_number: z.string().optional(),
  password: z.string().optional(),
  profile_picture: z.any().optional(),
});

export type ConfigurationsFormData = z.infer<typeof configurationsSchema>;
