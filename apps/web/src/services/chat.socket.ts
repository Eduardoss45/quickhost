import { io, Socket } from 'socket.io-client';
import { authStore } from '@/store/auth.store';

let chatSocket: Socket | null = null;

export function getChatSocket() {
  if (chatSocket) return chatSocket;

  const { user } = authStore.getState();
  if (!user) return null;

  chatSocket = io(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
    auth: {
      userId: user.userId,
    },
  });

  return chatSocket;
}
