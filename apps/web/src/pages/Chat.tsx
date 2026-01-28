import { useEffect, useState, useRef } from 'react';
import { authStore } from '@/store/auth.store';
import { Link } from 'react-router-dom';
import { TfiClose } from 'react-icons/tfi';
import { useUser } from '@/hooks/useUser';
import { useChat } from '@/hooks/useChat';
import { useChatSocket } from '@/hooks/useChatSocket';
import { IoSendOutline } from 'react-icons/io5';

import type { ChatMessagePayload, ChatRoom, PublicUser } from '@/types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

  const [text, setText] = useState('');

  const [rooms, setRooms] = useState<(ChatRoom & { otherUser?: PublicUser | null })[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  const otherUser = activeRoom?.otherUser;

  return (
    <div className="flex w-full h-screen">
      <aside
        className={`
    fixed inset-y-0 left-0 z-40 w-[320px] bg-white border-r flex flex-col h-full
    transform transition-transform duration-300
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    md:static md:translate-x-0
  `}
      >
        <div className="flex-1 overflow-y-auto px-3">
          <div className="space-y-3">
            {rooms.map(room => (
              <div
                key={room.roomId}
                onClick={() => {
                  setActiveRoomId(room.roomId);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition ${
                  room.roomId === activeRoomId
                    ? 'bg-orange-400/20 border border-orange-400'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Avatar className="h-10 w-10">
                  {room.otherUser?.profile_picture_url ? (
                    <AvatarImage
                      src={`${API_BASE_URL}${room.otherUser.profile_picture_url}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <AvatarFallback>{room.otherUser?.username?.[0] ?? '?'}</AvatarFallback>
                  )}
                </Avatar>

                <div>
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
        <div className="p-4 border-b flex items-center justify-between">
          <div className="md:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              Conversas
            </button>
          </div>

          <Link to="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
            <TfiClose className="text-2xl" />
            <span className="hidden sm:inline">Sair do chat</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
          {messages.map(msg => {
            const isMe = msg.author === 'me';

            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <Avatar className="h-9 w-9 mt-6 shrink-0">
                    {otherUser?.profile_picture_url ? (
                      <AvatarImage
                        src={`${API_BASE_URL}${otherUser.profile_picture_url}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <AvatarFallback>{getInitials(otherUser?.username)}</AvatarFallback>
                    )}
                  </Avatar>
                )}

                <div
                  className={`px-3 py-2 rounded-2xl max-w-[90%] sm:max-w-[75%] ${
                    isMe ? 'bg-blue-50' : 'bg-orange-50'
                  }`}
                >
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    {isMe
                      ? (user?.username ?? 'Você')
                      : (otherUser?.social_name ?? otherUser?.username ?? 'Usuário')}
                  </p>

                  <div
                    className={`px-4 py-2 rounded-2xl text-sm w-fit ${
                      isMe
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-orange-400 text-white rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>

                {isMe && (
                  <Avatar className="h-9 w-9 mt-6 shrink-0">
                    {user?.profile_picture_url ? (
                      <AvatarImage
                        src={`${API_BASE_URL}${user.profile_picture_url}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
                    )}
                  </Avatar>
                )}
              </div>
            );
          })}
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
