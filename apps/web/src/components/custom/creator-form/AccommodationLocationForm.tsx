import { useFormContext } from 'react-hook-form';
import type { AccommodationFormValues } from '@/schemas/accommodation-form.schema';

export default function AccommodationLocationForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AccommodationFormValues>();

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-2xl font-semibold">Localização da acomodação</h2>

      <div className="space-y-1">
        <input
          {...register('address')}
          placeholder="Endereço"
          className={`input outline-none p-2 border rounded-md w-full ${errors.address ? 'border-red-500' : ''}`}
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
      </div>

      <div className="space-y-1">
        <input
          {...register('neighborhood')}
          placeholder="Bairro"
          className={`input outline-none p-2 border rounded-md w-full ${errors.neighborhood ? 'border-red-500' : ''}`}
        />
        {errors.neighborhood && (
          <p className="text-sm text-red-500">{errors.neighborhood.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <input
          {...register('city')}
          placeholder="Cidade"
          className={`input outline-none p-2 border rounded-md w-full ${errors.city ? 'border-red-500' : ''}`}
        />
        {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
      </div>

      <div className="space-y-1">
        <input
          {...register('uf')}
          placeholder="UF"
          className={`input outline-none p-2 border rounded-md w-full ${errors.uf ? 'border-red-500' : ''}`}
        />
        {errors.uf && <p className="text-sm text-red-500">{errors.uf.message}</p>}
      </div>

      <div className="space-y-1">
        <input
          {...register('postal_code')}
          placeholder="CEP"
          className={`input outline-none p-2 border rounded-md w-full ${errors.postal_code ? 'border-red-500' : ''}`}
        />
        {errors.postal_code && <p className="text-sm text-red-500">{errors.postal_code.message}</p>}
      </div>
    </div>
  );
}
