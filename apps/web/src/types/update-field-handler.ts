import { AccommodationFormValues } from '@/schemas/accommodation-form.schema';

export type UpdateFieldHandler = <K extends keyof AccommodationFormValues>(
  key: K,
  value: AccommodationFormValues[K]
) => void;
