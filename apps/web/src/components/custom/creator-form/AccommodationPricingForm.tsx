import { useFormContext } from 'react-hook-form';
import { AccommodationFormValues } from '@/schemas/accommodation-form.schema';

export default function AccommodationPricingForm() {
  const { register } = useFormContext<AccommodationFormValues>();

  return (
    <div>
      <input
        type="number"
        {...register('price_per_night', { valueAsNumber: true })}
        placeholder="Preço por noite"
      />

      <input
        type="number"
        {...register('cleaning_fee', { valueAsNumber: true })}
        placeholder="Taxa de limpeza"
      />

      <label>
        <input type="checkbox" {...register('discount')} />
        Aplicar desconto
      </label>
    </div>
  );
}
