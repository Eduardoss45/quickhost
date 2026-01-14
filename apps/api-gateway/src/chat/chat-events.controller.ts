import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChatGateway } from './chat.gateway';

@Controller()
export class ChatEventsController {
  constructor(private readonly chatGateway: ChatGateway) {}

  @MessagePattern('chat.message.created')
  handleMessageCreated(message: any) {
    this.chatGateway.emitToRoom(message.chatRoomId, message);

    const recipientId =
      message.senderId === message.user1Id ? message.user2Id : message.user1Id;

    this.chatGateway.emitToUser(recipientId, {
      type: 'new-message',
      roomId: message.chatRoomId,
      preview: message.content,
    });
  }
}
