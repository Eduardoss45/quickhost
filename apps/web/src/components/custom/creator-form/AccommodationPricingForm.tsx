import { useFormContext } from 'react-hook-form';
import type { AccommodationFormValues } from '@/schemas/accommodation-form.schema';

export default function AccommodationPricingForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AccommodationFormValues>();

  return (
    <div>
      <div className="flex flex-col">
        <span>Preço por noite</span>
        <input
          className={`border outline-none p-2 w-1/3 rounded-md my-3 ${
            errors.price_per_night ? 'border-red-500' : ''
          }`}
          type="number"
          {...register('price_per_night', { valueAsNumber: true })}
          placeholder="Preço por noite"
        />
        {errors.price_per_night && (
          <p className="text-sm text-red-500 -mt-2 mb-2">{errors.price_per_night.message}</p>
        )}

        <span>Preço da limpeza</span>
        <input
          className={`border outline-none p-2 w-1/3 rounded-md my-3 ${
            errors.cleaning_fee ? 'border-red-500' : ''
          }`}
          type="number"
          {...register('cleaning_fee', { valueAsNumber: true })}
          placeholder="Taxa de limpeza"
        />
        {errors.cleaning_fee && (
          <p className="text-sm text-red-500 -mt-2 mb-2">{errors.cleaning_fee.message}</p>
        )}
      </div>

      <div className="flex flex-row gap-1 items-center">
        <input className="ml-1 mr-2 scale-150" type="checkbox" {...register('discount')} />
        Aplicar desconto
      </div>
    </div>
  );
}
