import { Accommodation } from '@/types';

interface Props {
  accommodation: Accommodation;
}

export default function BookingCard({ accommodation }: Props) {
  return (
    <aside className="border rounded-lg p-4 sticky top-4">
      <p className="text-lg font-semibold">R$ {accommodation.price_per_night} / noite</p>

      <p className="text-sm text-muted-foreground mt-1">
        Taxa de limpeza: R$ {accommodation.cleaning_fee}
      </p>

      <button
        className="mt-4 w-full bg-primary text-white py-2 rounded-md"
        disabled={!accommodation.is_active}
      >
        {accommodation.is_active ? 'Solicitar reserva' : 'Indisponível'}
      </button>
    </aside>
  );
}
