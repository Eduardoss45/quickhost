import { io, Socket } from 'socket.io-client';
import { authStore } from '@/store/auth.store';

let socket: Socket | null = null;

export const initSocket = () => {
  if (socket) return socket;

  const { user } = authStore.getState();

  if (!user) return null;

  socket = io(import.meta.env.VITE_API_BASE_URL + '/notifications', {
    auth: {
      userId: user.userId,
    },
  });

  return socket;
};
