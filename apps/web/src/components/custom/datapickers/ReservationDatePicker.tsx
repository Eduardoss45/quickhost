import { format, addDays, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Props {
  field: {
    value: Date | null;
    onChange: (value: Date | null) => void;
  };
  placeholder?: string;
}

export function ReservationDatePicker({ field, placeholder }: Props) {
  const today = new Date();
  const maxDate = addDays(today, 30);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-center bg-transparent py-6 border-none font-bold"
        >
          {field.value
            ? format(field.value, 'dd/MM', { locale: ptBR })
            : (placeholder ?? 'Selecionar data')}
          <span className="text-2xl">
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50 " />
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-2 bg-white border rounded-lg shadow-md" align="start">
        <Calendar
          mode="single"
          selected={field.value ?? undefined}
          onSelect={date => {
            if (!date) return;
            if (isBefore(date, today)) return;
            field.onChange(date);
          }}
          fromDate={today}
          toDate={maxDate}
          locale={ptBR}
          initialFocus
          classNames={{
            day_selected: 'bg-orange-400 text-white hover:bg-orange-500',
            day_today: 'border border-orange-400',
            nav_button: 'hover:bg-orange-100 text-orange-500 transition-colors',
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
