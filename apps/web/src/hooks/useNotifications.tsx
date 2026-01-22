import { useEffect } from 'react';
import { connectNotifications, disconnectNotifications } from '@/services/notifications.socket';
import { authStore } from '@/store/auth.store';
import { formatBookingNotification } from '@/formatters/notificationFormatter';
import type { BookingNotificationEvent } from '@/types/notifications';

export function useNotifications() {
  const user = authStore(state => state.user);

  useEffect(() => {
    if (!user) return;

    const socket = connectNotifications();

    const onNotification = (data: BookingNotificationEvent) => {
      const { type, payload } = data;
      formatBookingNotification({ type, payload });
    };

    socket.on('connect', () => {
      console.log('[WS] Connected');
    });

    socket.on('notification', onNotification);

    socket.on('disconnect', () => {
      console.log('[WS] Disconnected');
    });

    return () => {
      socket.off('notification', onNotification);
      disconnectNotifications();
    };
  }, [user]);
}
