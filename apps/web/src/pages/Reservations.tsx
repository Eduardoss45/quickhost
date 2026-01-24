import { useEffect, useState } from 'react';
import CardReservations from '../components/custom/CardReservations';
import { useBooking } from '@/hooks/useBooking';
import { useUser } from '@/hooks/useUser';
import { Booking } from '@/types';
import { Link } from 'react-router-dom';
import { TfiClose } from 'react-icons/tfi';

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
      <div className="flex justify-between flex-col md:flex-row md:mb-4">
        <div className="md:px-4 m-3 md:mx-10 mb-3 flex gap-2 items-center">
          <Link to="/" className="flex items-center gap-2 ">
            <TfiClose className="text-3xl" />
          </Link>

          <div>
            <h2 className="text-2xl">Minhas Reservas</h2>
          </div>
        </div>
      </div>

      {reservas.length > 0 ? (
        <div className="space-y-4">
          {reservas.map(reserva => {
            const flow = user?.id === reserva.hostId ? 'HOST' : 'GUEST';

            return (
              <CardReservations
                key={reserva.id}
                reserva={reserva}
                flow={flow}
                onUpdateReserva={(updatedReserva: Booking) => {
                  setReservas(prev =>
                    prev.map(r => (r.id === updatedReserva.id ? updatedReserva : r))
                  );
                }}
              />
            );
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
