import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export default function AccommodationAddressForm() {
  const { control } = useFormContext();

  return (
    <div className="space-y-6 md:m-10 m-3">
      <h2 className="text-3xl">Informe o endereço de sua acomodação</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'address', label: 'Endereço' },
          { name: 'neighborhood', label: 'Bairro/Distrito' },
          { name: 'city', label: 'Cidade' },
          { name: 'uf', label: 'UF' },
          { name: 'postal_code', label: 'CEP', colSpan: 2 },
        ].map(field => (
          <FormField
            key={field.name}
            control={control}
            name={field.name as any}
            render={({ field: f }) => (
              <FormItem className={field.colSpan ? 'md:col-span-2' : ''}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input {...f} className="py-5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
