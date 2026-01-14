import { useState } from 'react';
import { useChatSocket } from '@/hooks/new/useChatSocket';
import { authStore } from '@/store/auth.store';
import { initSocket } from '@/services/socket';

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

type Message = {
  id: string;
  author: 'me' | 'them';
  text: string;
};

export default function ChatPage() {
  const [mode, setMode] = useState<'anfitriao' | 'hospede'>('anfitriao');
  const [text, setText] = useState('');

  const user = authStore.getState().user;

  const conversations = [
    { id: 1, name: 'Gabriel Almeida' },
    { id: 2, name: 'Simone Andrade' },
    { id: 3, name: 'Bruno Carvalho' },
    { id: 4, name: 'Marina Cardoso' },
  ];

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', author: 'them', text: 'Boa tarde' },
    { id: '2', author: 'me', text: 'Boa tarde senhora Simone' },
    {
      id: '3',
      author: 'me',
      text: 'Está faltando ainda a ultima parcela do pagamento',
    },
    { id: '4', author: 'them', text: 'Desculpa, já vou enviar 👍' },
  ]);

  // 🔥 Recebendo mensagens em tempo real
  useChatSocket(msg => {
    const currentUser = authStore.getState().user;
    if (!currentUser) return;

    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        author: msg.from === currentUser.id ? 'me' : 'them',
        text: msg.content ?? msg.message,
      },
    ]);
  });

  // 📤 Enviar mensagem pelo socket
  function handleSend() {
    if (!text.trim() || !user) return;

    const socket = initSocket();
    if (!socket) return;

    const payload = {
      from: user.id,
      to: 'UUID_DESTINO_TESTE', // depois você liga isso à conversa selecionada
      content: text,
      chatRoomId: 'room-test',
    };

    socket.emit('chat.send', payload);

    // otimista: já mostra na tela sem esperar backend
    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        author: 'me',
        text,
      },
    ]);

    setText('');
  }

  return (
    <div className="h-screen w-full bg-white flex">
      {/* Sidebar */}
      <aside className="w-[320px] border-r flex flex-col">
        <div className="p-4 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 rounded-full flex items-center gap-1">
                {mode === 'anfitriao' ? 'Sou Anfitrião' : 'Sou Hóspede'}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setMode('hospede')}>Sou hóspede</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode('anfitriao')}>
                Sou anfitrião
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="rounded-full">
            Hóspedes
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-3">
            {conversations.map((c, i) => (
              <div
                key={c.id}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition ${
                  i === 1 ? 'bg-orange-400/20 border border-orange-400' : 'hover:bg-gray-100'
                }`}
              >
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/100" />
                  <AvatarFallback>{c.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-gray-500">Cliente:</p>
                  <p className="font-medium">{c.name}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        <div className="border-b p-4 text-center font-medium">Mensagens</div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <p className="text-center text-sm text-gray-400">Hoje</p>

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex items-end gap-3 ${
                  msg.author === 'me' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.author === 'them' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/100?img=47" />
                    <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[60%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.author === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.author === 'me' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/100?img=12" />
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
            <Button onClick={handleSend} className="bg-orange-400 hover:bg-orange-500 rounded-full">
              Enviar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
