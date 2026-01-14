import { useEffect } from 'react';
import { toast } from 'sonner';
import { getChatSocket } from '@/services/chat.socket';

type ChatNotification = {
  roomId: string;
  preview: string;
};

export function useChatNotifications() {
  useEffect(() => {
    const socket = getChatSocket();
    if (!socket) return;

    const handler = (data: ChatNotification) => {
      toast(`💬 Nova mensagem`, {
        description: data.preview,
      });
    };

    socket.on('chat.notification', handler);

    return () => {
      socket.off('chat.notification', handler);
    };
  }, []);
}
