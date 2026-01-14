import { useState } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { ChatRoom, ChatMessage } from '@/types/chat';

export function useChat() {
  const [loading, setLoading] = useState(false);

  const getRooms = async (): Promise<ChatRoom[]> => {
    try {
      const res = await api.get<ChatRoom[]>('/api/chat/rooms');
      return res.data;
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar conversas');
      return [];
    }
  };

  const getOrCreateRoom = async (user2Id: string): Promise<ChatRoom | null> => {
    setLoading(true);
    try {
      const res = await api.post<ChatRoom>('/api/chat/room', { user2Id });
      return res.data;
    } catch {
      toast.error('Erro ao criar conversa');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getMessages = async (roomId: string): Promise<ChatMessage[]> => {
    try {
      const res = await api.get<ChatMessage[]>(`/api/chat/room/${roomId}/messages`);
      return res.data;
    } catch {
      toast.error('Erro ao carregar mensagens');
      return [];
    }
  };

  const sendMessage = async (chatRoomId: string, content: string) => {
    if (!content.trim()) return;

    try {
      await api.post('/api/chat/send-message', {
        chatRoomId,
        content,
      });
    } catch {
      toast.error('Erro ao enviar mensagem');
    }
  };

  return {
    loading,
    getRooms,
    getOrCreateRoom,
    getMessages,
    sendMessage,
  };
}
