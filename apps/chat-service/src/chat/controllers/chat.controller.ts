import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Controller, Inject } from '@nestjs/common';
import { ChatService } from '../services/chat.service';

@Controller()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    @Inject('NOTIFICATIONS_CLIENT') private readonly client: ClientProxy,
  ) {}

  @MessagePattern('chat.send_message')
  async handleSendMessage(data: {
    chatRoomId: string;
    senderId: string;
    content: string;
  }) {
    const message = await this.chatService.sendMessage(
      data.chatRoomId,
      data.senderId,
      data.content,
    );
    await this.client.emit('chat.message.created', message);
    return message;
  }

  @MessagePattern('chat.get_or_create_room')
  async handleGetOrCreateRoom(data: { user1Id: string; user2Id: string }) {
    return this.chatService.getOrCreateRoom(data.user1Id, data.user2Id);
  }
}
