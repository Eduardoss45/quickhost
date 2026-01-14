import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ChatService } from '../services/chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern('chat.send_message')
  async sendMessage(data: {
    chatRoomId: string;
    senderId: string;
    content: string;
  }) {
    return this.chatService.sendMessage(
      data.chatRoomId,
      data.senderId,
      data.content,
    );
  }

  @MessagePattern('chat.get_or_create_room')
  async getOrCreateRoom(data: { user1Id: string; user2Id: string }) {
    return this.chatService.getOrCreateRoom(data.user1Id, data.user2Id);
  }

  @MessagePattern('chat.get_messages_room')
  async getMessages(data: { chatRoomId: string; limit?: number }) {
    return this.chatService.getMessages(data.chatRoomId, data.limit);
  }

  @MessagePattern('chat.get_user_rooms')
  async getUserRooms(data: { userId: string }) {
    return this.chatService.getUserRooms(data.userId);
  }

  @MessagePattern('chat.get_room_participants')
  async getRoomParticipants(data: { chatRoomId: string }) {
    return this.chatService.getRoomParticipants(data.chatRoomId);
  }
}
