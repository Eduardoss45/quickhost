import { useEffect } from 'react';
import { getChatSocket } from '@/services/chat.socket';

export function useChatSocket(chatRoomId: string, onMessage: (msg: any) => void) {
  useEffect(() => {
    const socket = getChatSocket();
    if (!socket) return;

    socket.emit('chat.join', { chatRoomId });

    socket.on('chat.message', onMessage);

    return () => {
      socket.off('chat.message', onMessage);
    };
  }, [chatRoomId, onMessage]);
}
