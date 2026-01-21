import { useEffect, useState } from 'react';
import { IoEyeOutline, IoChatbubbleOutline } from 'react-icons/io5';
import { PiPhoneThin, PiTrashSimple } from 'react-icons/pi';
import { CiLocationOn, CiUser } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';

import { Booking, Accommodation, PublicUser } from '@/types';
import { useAccommodation } from '@/hooks/useAccommodation';
import { useUser } from '@/hooks/useUser';
import { useBooking } from '@/hooks/useBooking';
import { useChat } from '@/hooks/useChat';

interface Props {
  reserva: Booking;
  flow: 'HOST' | 'GUEST';
}

export default function CardReservations({ reserva, flow }: Props) {
  const { getById } = useAccommodation();
  const { getPublicUser } = useUser();
  const { cancelBooking, confirmBooking } = useBooking();
  const { getOrCreateRoom } = useChat();
  const navigate = useNavigate();

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [host, setHost] = useState<PublicUser | null>(null);
  const [guest, setGuest] = useState<PublicUser | null>(null);

  useEffect(() => {
    async function load() {
      const acc = await getById(reserva.accommodationId);
      setAccommodation(acc);

      if (acc?.creator_id) {
        const hostData = await getPublicUser(acc.creator_id);
        setHost(hostData);
      }

      if (reserva.guestId) {
        const guestData = await getPublicUser(reserva.guestId);
        setGuest(guestData);
      }
    }

    load();
  }, [reserva.accommodationId, reserva.guestId]);

  const isPending = reserva.status === 'PENDING';
  const isConfirmed = reserva.status === 'CONFIRMED';
  const isCanceled = reserva.status.startsWith('CANCELED');

  const canConfirm = flow === 'HOST' && isPending;
  const canCancel = !isCanceled && (isPending || isConfirmed);

  const handleSendMessage = async () => {
    const targetUserId = flow === 'HOST' ? reserva.guestId : reserva.hostId;
    const room = await getOrCreateRoom(targetUserId);
    if (room) navigate('/chat');
  };

  if (!accommodation) {
    return <div className="border p-4 rounded-md">Carregando reserva...</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col p-4">
      {isCanceled && (
        <div className="bg-yellow-100 text-yellow-800 text-sm px-4 py-2 border-b mb-3">
          ⚠️ Esta reserva foi cancelada.
        </div>
      )}

      <div className="flex">
        <div className="w-48 aspect-4/3 overflow-hidden rounded-md">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${accommodation.internal_images?.[0]}`}
            alt="Vista da acomodação"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between p-4">
          <div>
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">{accommodation.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {host?.username || 'Anfitrião desconhecido'}
                </p>
              </div>

              <div className="text-sm">
                <div>
                  <span className="font-medium">Check-in:</span> {reserva.checkInDate}
                </div>
                <div>
                  <span className="font-medium">Check-out:</span> {reserva.checkOutDate}
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <CiLocationOn />
                <p>{accommodation.address}</p>
              </div>

              <div className="flex items-center gap-2">
                <PiPhoneThin />
                <p>{host?.phone_number || 'Telefone não disponível'}</p>
              </div>

              <div className="flex items-center gap-2">
                <CiUser />
                {flow === 'HOST' ? (
                  <p>Hóspede: {guest?.username || 'Hóspede desconhecido'}</p>
                ) : (
                  <p>Anfitrião: {host?.username || 'Anfitrião desconhecido'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-4 text-sm flex-wrap justify-start">
            <Link
              to={`/announcement/${accommodation.id}`}
              className="flex items-center gap-1 text-white bg-blue-500 rounded-md px-4 py-2 text-bold"
            >
              <span className='text-xl mr-1'>
              <IoEyeOutline />
              </span>
              Ver anúncio
            </Link>

            <button onClick={handleSendMessage} className="flex items-center gap-1 text-white bg-orange-400 rounded-md px-4">
              <span className='text-xl'>
              <IoChatbubbleOutline />
              </span>
              Mandar mensagem
            </button>

            {canConfirm && (
              <button
                onClick={() => confirmBooking(reserva.id)}
                className="flex items-center gap-1 text-white bg-green-400 rounded-md px-4"
              >
                Confirmar reserva
              </button>
            )}

            {canCancel && (
              <button
                onClick={() => cancelBooking(reserva.id)}
                className="flex items-center gap-1 text-white bg-red-400 rounded-md px-4"
              >
                <span className='text-xl'>
                <PiTrashSimple />
                </span>
                Cancelar hospedagem
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
