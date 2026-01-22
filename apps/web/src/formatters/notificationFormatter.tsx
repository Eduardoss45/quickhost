import { toast } from 'sonner';
import { CalendarCheck, CalendarX, Clock, Home, User, Bell } from 'lucide-react';

type FormatterArgs = {
  type: string;
  payload: any;
};

function ToastContent({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 mt-0.5 text-zinc-500" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

export function formatBookingNotification({ type, payload }: FormatterArgs) {
  switch (type) {
    case 'booking:created': {
      toast.info(
        <ToastContent
          icon={Clock}
          text={`Nova solicitação de reserva para "${payload.accommodationTitle}"`}
        />
      );
      return;
    }

    case 'booking:confirmed': {
      toast.success(
        <ToastContent
          icon={CalendarCheck}
          text={`Sua reserva em "${payload.accommodationTitle}" foi confirmada`}
        />
      );
      return;
    }

    case 'booking:canceled': {
      const by =
        payload.canceledBy === 'host'
          ? 'anfitrião'
          : payload.canceledBy === 'guest'
            ? 'hóspede'
            : 'sistema';

      toast.warning(
        <ToastContent
          icon={CalendarX}
          text={`Reserva em "${payload.accommodationTitle}" cancelada pelo ${by}`}
        />
      );
      return;
    }

    default:
      toast(<ToastContent icon={Bell} text="Nova notificação" />);
  }
}
