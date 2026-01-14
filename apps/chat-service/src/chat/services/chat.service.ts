import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from '../entities/chat-room.entity';
import { Message } from '../entities/message.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepo: Repository<ChatRoom>,

    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @Inject('CHAT_GATEWAY_CLIENT')
    private readonly gatewayClient: ClientProxy,
  ) {}

  async getOrCreateRoom(user1Id: string, user2Id: string) {
    let room = await this.chatRoomRepo.findOne({
      where: [
        { user1Id, user2Id },
        { user1Id: user2Id, user2Id: user1Id },
      ],
    });

    if (!room) {
      room = this.chatRoomRepo.create({ user1Id, user2Id });
      await this.chatRoomRepo.save(room);
    }

    return room;
  }

  async sendMessage(chatRoomId: string, senderId: string, content: string) {
    const message = this.messageRepo.create({
      chatRoomId,
      senderId,
      content,
    });

    await this.messageRepo.save(message);

    this.gatewayClient.emit('chat.message.created', message);

    return message;
  }

  async getMessages(chatRoomId: string, limit = 50) {
    return this.messageRepo.find({
      where: { chatRoomId },
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }

  async getUserRooms(userId: string) {
    const rooms = await this.chatRoomRepo.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
    });

    return rooms.map((room) => ({
      roomId: room.id,
      otherUserId: room.user1Id === userId ? room.user2Id : room.user1Id,
    }));
  }

  async getRoomParticipants(chatRoomId: string) {
    const room = await this.chatRoomRepo.findOneBy({ id: chatRoomId });
    if (!room) return [];
    return [room.user1Id, room.user2Id];
  }
}
