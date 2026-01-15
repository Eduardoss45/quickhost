import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AccommodationAddressForm() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Informe o endereço de sua acomodação</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'address', label: 'Endereço', placeholder: 'Digite o endereço da acomodação' },
          {
            name: 'neighborhood',
            label: 'Bairro/Distrito',
            placeholder: 'Digite o bairro/distrito',
          },
          { name: 'city', label: 'Cidade', placeholder: 'Digite a cidade' },
          { name: 'uf', label: 'UF', placeholder: 'Digite o estado/província' },
          { name: 'postal_code', label: 'CEP', placeholder: 'Digite o CEP', colSpan: 2 },
        ].map(field => (
          <div key={field.name} className={`space-y-1 ${field.colSpan ? 'md:col-span-2' : ''}`}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Controller
              name={field.name}
              control={control}
              render={({ field: f }) => (
                <Input {...f} id={field.name} placeholder={field.placeholder} />
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
