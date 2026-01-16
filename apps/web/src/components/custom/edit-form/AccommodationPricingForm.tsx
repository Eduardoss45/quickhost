import { useFormContext } from 'react-hook-form';
import { AccommodationFormValues } from '@/schemas/accommodation-form.schema';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

export default function AccommodationPricingForm() {
  const { control } = useFormContext<AccommodationFormValues>();

  const sanitizeNumberInput = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');

    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }

    return cleaned;
  };

  return (
    <div className="space-y-8 m-10">
      <div>
        <h2 className="text-2xl">Determine o valor da sua diária</h2>

        <FormField
          control={control}
          name="price_per_night"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mt-3">Valor da diária</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2 border-0 rounded-md my-3 px-6 py-2 outline w-1/2">
                  <span className="font-semibold">R$</span>
                  <input
                    className="border-none outline-none w-1/2"
                    type="text"
                    value={field.value ?? ''}
                    onChange={e => {
                      const sanitized = sanitizeNumberInput(e.target.value);
                      field.onChange(Number(sanitized) || 0);
                    }}
                    placeholder="0.00"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-sm text-muted-foreground mt-2">
          Será cobrada uma taxa de serviço de 15% sobre o valor da acomodação.
        </p>
      </div>

      <div>
        <h2 className="text-2xl">Taxa de limpeza</h2>

        <FormField
          control={control}
          name="cleaning_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mt-3">Valor</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2 border-0 rounded-md my-3 px-6 py-2 outline w-1/2">
                  <span className="font-semibold">R$</span>
                  <input
                    className="border-none outline-none w-1/2"
                    type="text"
                    value={field.value ?? ''}
                    onChange={e => {
                      const sanitized = sanitizeNumberInput(e.target.value);
                      field.onChange(Number(sanitized) || 0);
                    }}
                    placeholder="0.00"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h2 className="text-2xl">Desconto</h2>

        <FormField
          control={control}
          name="discount"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 my-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={checked => field.onChange(Boolean(checked))}
                />
              </FormControl>
              <div>
                <FormLabel>Novos anúncios</FormLabel>
                <p className="text-sm text-muted-foreground">Desconto de 20% na primeira reserva</p>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
