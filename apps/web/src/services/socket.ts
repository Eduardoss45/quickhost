import { io, Socket } from 'socket.io-client';
import { authStore } from '@/store/auth.store';
import { toast } from 'sonner';

let socket: Socket | null = null;

export const initSocket = () => {
  const { user } = authStore.getState();

  if (!user) {
    console.warn('Usuário não autenticado, não será possível iniciar o socket.');
    return;
  }

  if (socket) return socket;

  socket = io(import.meta.env.VITE_API_BASE_URL + '/notifications', {
    auth: { userId: user.id },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Socket conectado! ID do socket:', socket!.id);
    toast.success('Conectado ao servidor de notificações!');
  });

  socket.on('notification', (data: any) => {
    console.log('Nova notificação recebida:', data);
    toast.info(`Nova notificação: ${data.type}`, {
      description: JSON.stringify(data.payload),
    });
  });

  socket.on('chat.message', (msg: any) => {
    console.log('Mensagem de chat recebida:', msg);
    toast(`Nova mensagem de ${msg.from}: ${msg.message}`);
  });

  socket.on('disconnect', reason => {
    console.log('Socket desconectado:', reason);
    toast.error(`Desconectado do servidor: ${reason}`);
  });

  return socket;
};