import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FormControl } from '@/components/ui/form';

interface Props {
  field: {
    value: string;
    onChange: (value: string) => void;
  };

  showLabel?: boolean;
  labelText?: string;
}

export function BirthDatePicker({ field }: Props) {
  const selectedDate = field.value ? parse(field.value, 'yyyy-MM-dd', new Date()) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button variant="outline" className="w-full justify-between bg-transparent py-6">
            {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Selecione a data'}
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-2 bg-white border rounded-lg shadow-md" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={date => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
          captionLayout="dropdown"
          fromYear={1900}
          toYear={new Date().getFullYear()}
          locale={ptBR}
          initialFocus
          classNames={{
            day_selected: 'bg-orange-400 text-white hover:bg-orange-500',
            day_today: 'border border-orange-400',
            nav_button: 'hover:bg-orange-100 text-orange-500 transition-colors',
            nav_button_previous: 'text-orange-500',
            nav_button_next: 'text-orange-500',
            caption_dropdowns: 'bg-white',
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
