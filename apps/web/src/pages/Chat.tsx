import { useEffect, useState, useRef } from 'react';
import { authStore } from '@/store/auth.store';

import { useUser } from '@/hooks/useUser';
import { useChat } from '@/hooks/useChat';
import { useChatSocket } from '@/hooks/useChatSocket';
import { IoSendOutline } from 'react-icons/io5';

import type { ChatMessagePayload, ChatRoom, PublicUser } from '@/types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ChevronDown } from 'lucide-react';

type UiMessage = {
  id: string;
  author: 'me' | 'them';
  text: string;
};

export default function Chat() {
  const user = authStore(state => state.user);
  const userId = user?.id;

  const { getPublicUser } = useUser();
  const { getRooms, getMessages, sendMessage } = useChat();

  const [mode, setMode] = useState<'anfitriao' | 'hospede'>('anfitriao');
  const [text, setText] = useState('');

  const [rooms, setRooms] = useState<(ChatRoom & { otherUser?: PublicUser | null })[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      const data = await getRooms();
      const hydrated = await Promise.all(
        data.map(async room => ({
          ...room,
          otherUser: await getPublicUser(room.otherUserId),
        }))
      );

      setRooms(hydrated);
      if (hydrated.length > 0) {
        setActiveRoomId(hydrated[0]!.roomId);
      }
    })();
  }, [userId]);

  function getInitials(name?: string | null) {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length === 1) return (parts[0] ?? '').slice(0, 2).toUpperCase();
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  }

  useEffect(() => {
    if (!activeRoomId || !userId) return;

    (async () => {
      const history = await getMessages(activeRoomId);

      setMessages(
        history.map(msg => ({
          id: msg.id,
          author: msg.senderId === userId ? 'me' : 'them',
          text: msg.content,
        }))
      );
    })();
  }, [activeRoomId, userId]);

  useChatSocket(activeRoomId, (msg: ChatMessagePayload) => {
    if (!userId) return;

    setMessages(prev => [
      ...prev,
      {
        id: msg.id,
        author: msg.senderId === userId ? 'me' : 'them',
        text: msg.content,
      },
    ]);
  });

  async function handleSend() {
    if (!text.trim() || !userId || !activeRoomId) return;

    await sendMessage(activeRoomId, text);
    setText('');
  }

  const activeRoom = rooms.find(r => r.roomId === activeRoomId);

  return (
    <div className="flex w-full h-screen">
      <aside className="w-[320px] border-r flex flex-col h-full">
        <div className="p-4 flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full flex items-center gap-1">
                {mode === 'anfitriao' ? 'Sou Anfitrião' : 'Sou Hóspede'}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setMode('hospede')}>Sou hóspede</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode('anfitriao')}>
                Sou anfitrião
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <div className="space-y-3">
            {rooms.map(room => (
              <div
                key={room.roomId}
                onClick={() => setActiveRoomId(room.roomId)}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition ${
                  room.roomId === activeRoomId
                    ? 'bg-orange-400/20 border border-orange-400'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Avatar>
                  <AvatarImage src={room.otherUser?.profile_picture_url ?? ''} />
                  <AvatarFallback>{room.otherUser?.username?.[0] ?? '?'}</AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm text-gray-500">Cliente:</p>
                  <p className="font-medium">
                    {room.otherUser?.social_name ?? room.otherUser?.username ?? 'Usuário'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.author === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.author === 'them' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(activeRoom?.otherUser?.username)}</AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[60%] px-4 py-2 rounded-2xl text-sm ${
                  msg.author === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                {msg.text}
              </div>

              {msg.author === 'me' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="m-4 p-4 shrink-0 shadow-sm rounded-md">
          <div className="flex justify-between gap-2 ">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Digite uma mensagem"
              className="rounded-sm w-full outline-none"
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>
              <span>
                <IoSendOutline className="text-3xl" />
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
