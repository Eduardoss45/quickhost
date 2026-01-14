import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,

    @Inject('GATEWAY_NOTIFICATIONS_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  async persistAndDispatch(
    userId: string,
    type: string,
    payload: Record<string, any>,
  ): Promise<Notification> {
    const notification = await this.notificationRepo.save({
      userId,
      type,
      payload,
      read: false,
    });

    this.client.emit('notification.dispatch', { userId, type, payload });

    if (type === 'chat_message') {
      this.client.emit('notification.dispatch', {
        userId,
        type: 'chat.message',
        payload: {
          from: payload.senderId,
          message: payload.content,
          chatRoomId: payload.chatRoomId,
        },
      });
    }

    return notification;
  }
}
