import { useEffect } from 'react';
import { initSocket } from '@/services/socket';

export function useChatSocket(onMessage: (msg: any) => void) {
  useEffect(() => {
    const socket = initSocket();
    if (!socket) return;

    socket.on('chat.message', onMessage);

    return () => {
      socket.off('chat.message', onMessage);
    };
  }, [onMessage]);
}
