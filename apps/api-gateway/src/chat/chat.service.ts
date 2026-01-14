import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_CLIENT') private readonly chatClient: ClientProxy,
  ) {}

  sendMessage(payload: {
    chatRoomId: string;
    senderId: string;
    content: string;
  }) {
    return firstValueFrom(this.chatClient.send('chat.send_message', payload));
  }

  getOrCreateRoom(payload: { user1Id: string; user2Id: string }) {
    return firstValueFrom(
      this.chatClient.send('chat.get_or_create_room', payload),
    );
  }

  getMessages(payload: { chatRoomId: string; limit?: number }) {
    return firstValueFrom(
      this.chatClient.send('chat.get_messages_room', payload),
    );
  }
}
