import { useEffect, useState } from 'react';
import { authStore } from '@/store/auth.store';

import { useUser } from '@/hooks/new/useUser';
import { useChat } from '@/hooks/new/useChat';
import { useChatSocket } from '@/hooks/new/useChatSocket';

import { getChatSocket } from '@/services/chat.socket';

import type { ChatMessagePayload, ChatRoom } from '@/types/chat';
import type { PublicUser } from '@/types/user';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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

export default function ChatPage() {
  const user = authStore(state => state.user);
  const userId = user?.id;

  const { getPublicUser } = useUser();
  const { getRooms, getMessages, sendMessage } = useChat();

  const [mode, setMode] = useState<'anfitriao' | 'hospede'>('anfitriao');
  const [text, setText] = useState('');

  const [rooms, setRooms] = useState<(ChatRoom & { otherUser?: PublicUser | null })[]>([]);

  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);

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
    <div className="h-screen w-full bg-white flex">
      <aside className="w-[320px] border-r flex flex-col">
        <div className="p-4 flex items-center gap-2">
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

        <ScrollArea className="flex-1 px-3">
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
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="border-b p-4 text-center font-medium">
          {activeRoom?.otherUser?.username ?? 'Mensagens'}
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-end gap-3 ${
                  msg.author === 'me' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.author === 'them' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{activeRoom?.otherUser?.username?.[0] ?? 'U'}</AvatarFallback>
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
                    <AvatarFallback>EU</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Digite uma mensagem"
              className="rounded-full"
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} className="rounded-full">
              Enviar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
