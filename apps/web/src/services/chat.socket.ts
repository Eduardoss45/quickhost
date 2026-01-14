import { io, Socket } from 'socket.io-client';
import { authStore } from '@/store/auth.store';

let chatSocket: Socket | null = null;

export function getChatSocket() {
  if (chatSocket) return chatSocket;

  const { user } = authStore.getState();
  if (!user) return null;

  chatSocket = io(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
    auth: {
      userId: user.id,
    },
  });

  chatSocket.on('connect', () => {
    console.log('🟢 Socket conectado:', chatSocket?.id);
  });

  chatSocket.on('disconnect', () => {
    console.log('🔴 Socket desconectado');
  });

  chatSocket.on('connect_error', err => {
    console.error('❌ Erro socket:', err.message);
  });

  return chatSocket;
}
