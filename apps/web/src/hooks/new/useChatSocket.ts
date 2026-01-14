import { useEffect, useRef } from 'react';
import { getChatSocket } from '@/services/chat.socket';

export function useChatSocket(chatRoomId: string | null, onMessage: (msg: any) => void) {
  const handlerRef = useRef(onMessage);

  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!chatRoomId) return;

    const socket = getChatSocket();
    if (!socket) return;

    const handler = (msg: any) => handlerRef.current(msg);

    socket.emit('chat.join', { chatRoomId });
    socket.on('chat.message', handler);

    return () => {
      socket.off('chat.message', handler);
    };
  }, [chatRoomId]);
}
