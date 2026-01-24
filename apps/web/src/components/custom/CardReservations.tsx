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
  onUpdateReserva?: (reserva: Booking) => void;
}

export default function CardReservations({ reserva, flow, onUpdateReserva }: Props) {
  const { getById } = useAccommodation();
  const { getPublicUser } = useUser();
  const { cancelBooking, confirmBooking, getUserBookings } = useBooking();
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

  const handleCancel = async () => {
    const res = await cancelBooking(reserva.id);
    if (res) {
      const updatedReserva = await getUserBookings();
      const myUpdated = updatedReserva.find(r => r.id === reserva.id);
      if (myUpdated && onUpdateReserva) onUpdateReserva(myUpdated);
    }
  };

  const handleConfirm = async () => {
    const res = await confirmBooking(reserva.id);
    if (res) {
      const updatedReserva = await getUserBookings();
      const myUpdated = updatedReserva.find(r => r.id === reserva.id);
      if (myUpdated && onUpdateReserva) onUpdateReserva(myUpdated);
    }
  };

  const handleSendMessage = async () => {
    const targetUserId = flow === 'HOST' ? reserva.guestId : reserva.hostId;
    const room = await getOrCreateRoom(targetUserId);
    if (room) navigate('/chat');
  };

  if (!accommodation) {
    return <div className="border p-4 rounded-md">Carregando reserva...</div>;
  }

  return (
    <div className="shadow-2xl overflow-hidden flex flex-col p-4 brightness-95">
      {isCanceled && (
        <div className="text-red-500 text-sm px-4 py-2 border-b border-black mb-3">
          ⚠️ Esta reserva foi cancelada.
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:flex-1 max-w-md aspect-4/3 overflow-hidden rounded-md">
          <img
            src={`${import.meta.env.VITE_API_URL}${accommodation.internal_images?.[0]}`}
            alt="Vista da acomodação"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between p-4">
          <div>
            <div className="flex justify-between flex-col md:flex-row">
              <div>
                <h2 className="text-xl">{accommodation.title}</h2>
                <p className="text-muted-foreground">
                  {host?.username || 'Anfitrião desconhecido'}
                </p>
              </div>

              <div className="text-sm shadow-2xl">
                <div className="border rounded-md mb-3 p-3 bg-blue-500 text-white font-bold">
                  <span className="font-xs my-2">Check-in:</span> {reserva.checkInDate}
                </div>
                <div className="border rounded-md p-3 bg-blue-500 text-white font-bold">
                  <span className="font-xs my-2">Check-out:</span> {reserva.checkOutDate}
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <CiLocationOn className="text-2xl" />
                <p>{accommodation.address}</p>
              </div>

              <div className="flex items-center gap-2">
                <PiPhoneThin className="text-2xl" />
                <p>{host?.phone_number || 'Telefone não disponível'}</p>
              </div>

              <div className="flex items-center gap-2">
                <CiUser className="text-2xl" />
                {flow === 'HOST' ? (
                  <p>Hóspede: {guest?.username || 'Hóspede desconhecido'}</p>
                ) : (
                  <p>Anfitrião: {host?.username || 'Anfitrião desconhecido'}</p>
                )}
              </div>

              <div className="border-t pt-2 mt-2">
                <p className="my-2">
                  <span className="font-xs">Preço por noite:</span> ${reserva.pricePerNight}
                </p>
                <p className="my-2">
                  <span className="font-xs">Total de dias:</span> {reserva.totalDays}
                </p>
                <p className="my-2">
                  <span className="font-xs">Taxa de limpeza:</span> ${reserva.cleaningFee}
                </p>
                <p className="my-2">
                  <span className="font-xs">Taxa de serviço:</span>{' '}
                  {Number(reserva.serviceFeeMultiplier) > 1
                    ? `${((reserva.serviceFeeMultiplier - 1) * 100).toFixed(0)}%`
                    : '0%'}
                </p>
                <p className="font-medium text-xl">
                  <span>Valor final:</span> R${reserva.finalAmount}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-4 text-sm flex-wrap justify-start">
            <Link
              to={`/announcement/${accommodation.id}`}
              className="flex items-center gap-1 text-white bg-blue-500 rounded-md px-4 py-2 text-bold"
            >
              <span className="text-xl mr-1">
                <IoEyeOutline />
              </span>
              Ver anúncio
            </Link>

            <button
              onClick={handleSendMessage}
              className="flex items-center gap-1 text-white bg-orange-400 rounded-md px-4 py-2"
            >
              <span className="text-xl">
                <IoChatbubbleOutline />
              </span>
              Mandar mensagem
            </button>

            {canConfirm && (
              <button
                onClick={handleConfirm}
                className="flex items-center gap-1 text-white bg-green-400 rounded-md px-4 py-2"
              >
                Confirmar reserva
              </button>
            )}

            {canCancel && (
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 text-white bg-red-400 rounded-md px-4 py-2"
              >
                <PiTrashSimple className="text-xl" />
                Cancelar hospedagem
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
