import { useEffect, useState } from 'react';
import CardReservations from './CardReservations';
import { useBooking } from '@/hooks/useBooking';
import { useUser } from '@/hooks/useUser';
import { Booking } from '@/types';

export default function Reservations() {
  const { getUserBookings } = useBooking();
  const { user } = useUser();

  const [reservas, setReservas] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getUserBookings();
      setReservas(data);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return <p>Carregando reservas...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Minhas Reservas</h2>

      {reservas.length > 0 ? (
        <div className="space-y-4">
          {reservas.map(reserva => {
            const flow = user?.id === reserva.hostId ? 'HOST' : 'GUEST';

            return <CardReservations key={reserva.id} reserva={reserva} flow={flow} />;
          })}
        </div>
      ) : (
        <div className="mt-4">
          <p>Parece que você não tem nenhuma reserva ativa.</p>
        </div>
      )}
    </div>
  );
}
