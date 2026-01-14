import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from '../services/notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @EventPattern('chat.message.created')
  async handleChatMessage(@Payload() payload: any) {
    const { chatRoomId, senderId, receiverId, content } = payload;

    await this.service.persistAndDispatch(receiverId, 'chat_message', {
      chatRoomId,
      senderId,
      content,
    });
  }
}
