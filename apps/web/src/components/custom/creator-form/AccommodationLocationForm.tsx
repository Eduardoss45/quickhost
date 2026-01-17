import { useFormContext } from 'react-hook-form';
import type { AccommodationFormValues } from '@/schemas/accommodation-form.schema';

export default function AccommodationLocationForm() {
  const { register } = useFormContext<AccommodationFormValues>();

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-semibold">Localização da acomodação</h2>

      <input {...register('address')} placeholder="Endereço" className="input" />
      <input {...register('neighborhood')} placeholder="Bairro" className="input" />
      <input {...register('city')} placeholder="Cidade" className="input" />
      <input {...register('uf')} placeholder="UF" className="input" />
      <input {...register('postal_code')} placeholder="CEP" className="input" />
    </div>
  );
}
