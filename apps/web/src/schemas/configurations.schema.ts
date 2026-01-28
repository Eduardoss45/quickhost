import { z } from 'zod';

export const configurationsSchema = z
  .object({
    username: z.string().min(3, 'Nome muito curto'),
    cpf: z.string().length(11),
    birth_date: z.string(),
    social_name: z.string().optional(),
    email: z.string().email(),
    phone_number: z
      .string()
      .optional()
      .refine(
        val => {
          if (!val) return true;
          const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?(9?\d{4})[-\s]?\d{4}$/;
          return phoneRegex.test(val);
        },
        {
          message: 'Telefone inválido. Use o formato (11) 99999-9999',
        }
      ),
    password: z.string().optional(),
    confirm_password: z.string().optional(),
    profile_picture: z.any().optional(),
  })
  .refine(data => !data.password || data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'As senhas não coincidem',
  });

export type ConfigurationsFormData = z.infer<typeof configurationsSchema>;
