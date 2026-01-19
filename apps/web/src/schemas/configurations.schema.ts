import { z } from 'zod';

export const configurationsSchema = z
  .object({
    username: z.string().min(3, 'Nome muito curto'),
    cpf: z.string().length(11),
    birth_date: z.string(),
    social_name: z.string().optional(),
    email: z.string().email(),
    phone_number: z.string().optional(),
    password: z.string().optional(),
    confirm_password: z.string().optional(),
    profile_picture: z.any().optional(),
  })
  .refine(data => !data.password || data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'As senhas não coincidem',
  });

export type ConfigurationsFormData = z.infer<typeof configurationsSchema>;
