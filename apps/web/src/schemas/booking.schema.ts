import { z } from 'zod';
import { differenceInCalendarDays, isAfter } from 'date-fns';

export const bookingSchema = z
  .object({
    checkIn: z.date({
      error: 'Selecione a data de check-in',
    }),
    checkOut: z.date({
      error: 'Selecione a data de check-out',
    }),
  })
  .refine(data => isAfter(data.checkOut, data.checkIn), {
    message: 'O check-out deve ser após o check-in',
    path: ['checkOut'],
  })
  .refine(data => differenceInCalendarDays(data.checkOut, data.checkIn) <= 30, {
    message: 'A reserva não pode ultrapassar 30 dias',
    path: ['checkOut'],
  });

export type BookingFormData = z.infer<typeof bookingSchema>;
