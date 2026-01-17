import { useFormContext } from 'react-hook-form';
import { AccommodationFormValues } from '@/schemas/accommodation-form.schema';

export default function AccommodationDescriptionForm() {
  const { register, watch } = useFormContext<AccommodationFormValues>();

  const title = watch('title') ?? '';
  const description = watch('description') ?? '';

  return (
    <div>
      <h2>Descrição</h2>

      <input {...register('title')} maxLength={32} placeholder="Título" />

      <textarea {...register('description')} maxLength={400} placeholder="Descrição" />

      <p>{title.length}/32</p>
      <p>{description.length}/400</p>
    </div>
  );
}
