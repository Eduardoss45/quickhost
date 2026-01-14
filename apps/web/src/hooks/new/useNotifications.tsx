import { useEffect } from 'react';
import { toast } from 'sonner';
import { getChatSocket } from '@/services/chat.socket';

type ChatNotification = {
  roomId: string;
  preview: string;
  message: string;
  senderName: string;
  senderProfilePicture?: string | null;
  deliveredAt: string;
};

export function useChatNotifications() {
  useEffect(() => {
    const socket = getChatSocket();
    if (!socket) return;

    const handler = (data: ChatNotification) => {
      toast(`${data.senderName} 💬`, {
        description: data.message,
        icon: data.senderProfilePicture ? (
          <img
            src={
              data.senderProfilePicture
                ? `${import.meta.env.VITE_API_BASE_URL}${data.senderProfilePicture}`
                : undefined
            }
            alt={data.senderName}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : undefined,
      });
    };

    socket.on('chat.notification', handler);

    return () => {
      socket.off('chat.notification', handler);
    };
  }, []);
}
