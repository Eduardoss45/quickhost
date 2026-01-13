import { z } from 'zod';
import { subYears, isAfter, parse } from 'date-fns';

export const registerSchema = z
  .object({
    username: z.string().min(3, 'Usuário deve ter ao menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    cpf: z
      .string()
      .length(11, 'CPF deve conter 11 dígitos')
      .regex(/^\d+$/, 'CPF deve conter apenas números'),

    birth_date: z
      .string()
      .refine(
        val => {
          const date = parse(val, 'yyyy-MM-dd', new Date());
          return !isAfter(date, new Date());
        },
        { message: 'A data não pode estar no futuro' }
      )
      .refine(
        val => {
          const date = parse(val, 'yyyy-MM-dd', new Date());
          return date <= subYears(new Date(), 18);
        },
        { message: 'Você deve ter pelo menos 18 anos' }
      ),

    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirm_password: z.string(),
  })
  .refine(data => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'As senhas não coincidem',
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
