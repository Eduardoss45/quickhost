import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
