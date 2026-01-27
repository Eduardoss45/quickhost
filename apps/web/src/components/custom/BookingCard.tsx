import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { bookingSchema, BookingFormData } from '@/schemas/booking.schema';
import { ReservationDatePicker } from '@/components/custom/datapickers/ReservationDatePicker';
import { Accommodation } from '@/types';
import { differenceInCalendarDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/hooks/useChat';
import { useBooking } from '@/hooks/useBooking';
import { authStore } from '@/store/auth.store';

interface Props {
  accommodation: Accommodation;
}

export default function BookingCard({ accommodation }: Props) {
  const navigate = useNavigate();
  const { getOrCreateRoom } = useChat();
  const { createBooking, loading } = useBooking();
  const user = authStore(state => state.user);

  const isCreator = user?.id === accommodation.creator_id;

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const SERVICE_FEE_MULTIPLIER = 1.15;

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

  const pricePerNight = Number(accommodation.price_per_night);
  const cleaningFee = Number(accommodation.cleaning_fee);

  const nights = checkIn && checkOut ? Math.max(differenceInCalendarDays(checkOut, checkIn), 0) : 0;

  const baseSubtotal = nights * pricePerNight;
  const subtotalWithFee = baseSubtotal * SERVICE_FEE_MULTIPLIER;

  const total = nights > 0 && Number.isFinite(subtotalWithFee) ? subtotalWithFee + cleaningFee : 0;

  function formatDisplayDate(date: Date | string) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
  }

  function formatDateOnly(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  const onSubmit = async (data: BookingFormData) => {
    if (isCreator) return;
    await createBooking({
      accommodationId: accommodation.id,
      hostId: accommodation.creator_id,
      checkInDate: formatDateOnly(data.checkIn),
      checkOutDate: formatDateOnly(data.checkOut),
    });
  };

  const handleSendMessage = async () => {
    if (isCreator) return;
    const room = await getOrCreateRoom(accommodation.creator_id);

    if (room) {
      navigate('/chat');
    }
  };

  return (
    <aside className="shadow-2xl rounded-lg p-4 sticky top-4 w-full">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row justify-between gap-2">
            <div className="w-1/2 shadow-2xl rounded-md py-3 mb-3 text-center">
              <p className="font-bold">Check-in</p>

              <Controller
                control={control}
                name="checkIn"
                render={({ field }) => (
                  <ReservationDatePicker field={field} placeholder="Selecionar" />
                )}
              />

              {errors.checkIn && (
                <p className="text-xs text-red-500 mt-1">{errors.checkIn.message}</p>
              )}
            </div>

            <div className="w-1/2 shadow-2xl rounded-md py-3 mb-3 text-center">
              <p className="font-bold">Check-out</p>

              <Controller
                control={control}
                name="checkOut"
                render={({ field }) => (
                  <ReservationDatePicker field={field} placeholder="Selecionar" />
                )}
              />

              {errors.checkOut && (
                <p className="text-xs text-red-500 mt-1">{errors.checkOut.message}</p>
              )}
            </div>
          </div>

          <p className="text-lg font-semibold">R$ {pricePerNight.toFixed(2)} / noite</p>

          <p className="text-sm text-muted-foreground mt-1">
            Taxa de limpeza: R$ {cleaningFee.toFixed(2)}
          </p>

          {nights > 0 && Number.isFinite(total) && (
            <p className="text-sm mt-2 font-medium">
              Total ({nights} noites): R$ {total.toFixed(2)}
            </p>
          )}

          {!accommodation.is_active && accommodation.next_available_date && (
            <div className="mt-3 rounded-md border border-yellow-300 bg-yellow-50 p-2 text-sm text-yellow-800">
              Próxima data disponível a partir de{' '}
              <strong>{formatDisplayDate(accommodation.next_available_date)}</strong>
            </div>
          )}

          <button
            type="submit"
            className="shadow-2xl mt-4 w-full bg-blue-500 text-white py-2 my-2 rounded-md disabled:opacity-50"
            disabled={!accommodation.is_active || loading || isCreator}
          >
            {loading
              ? 'Processando...'
              : isCreator
                ? 'Você é o criador'
                : accommodation.is_active
                  ? 'Solicitar reserva'
                  : 'Indisponível'}
          </button>

          <button
            type="button"
            onClick={handleSendMessage}
            className="shadow-2xl mt-2 w-full bg-orange-400 text-white py-2 rounded-md"
            disabled={isCreator}
          >
            {isCreator ? 'Não é possível enviar mensagem' : 'Enviar mensagem'}
          </button>
        </form>
      </Form>
    </aside>
  );
}
