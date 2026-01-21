import { useFormContext } from 'react-hook-form';
import type { AccommodationFormValues } from '@/schemas/accommodation-form.schema';

export default function AccommodationDescriptionForm() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<AccommodationFormValues>();

  const title = watch('title') ?? '';
  const description = watch('description') ?? '';

  return (
    <div>
      <h2 className="text-2xl">Descrição</h2>

      <div className="mt-3 space-y-1">
        <input
          {...register('title')}
          maxLength={32}
          placeholder="Título"
          className={`w-1/3 p-2 outline-none border rounded-md ${
            errors.title ? 'border-red-500' : ''
          }`}
        />
        <div className="flex justify-between text-sm">
          <p className="text-gray-500">{title.length}/32</p>
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <textarea
          {...register('description')}
          maxLength={400}
          placeholder="Descrição"
          className={`w-full min-h-30 p-2 outline-none border rounded-md ${
            errors.description ? 'border-red-500' : ''
          }`}
        />
        <div className="flex justify-between text-sm">
          <p className="text-gray-500">{description.length}/400</p>
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>
      </div>
    </div>
  );
}
