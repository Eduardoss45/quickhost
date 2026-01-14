import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from '../entities/chat-room.entity';
import { Message } from '../entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom) private chatRoomRepo: Repository<ChatRoom>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
  ) {}

  async getOrCreateRoom(user1Id: string, user2Id: string): Promise<ChatRoom> {
    let room = await this.chatRoomRepo.findOne({
      where: [
        { user1Id, user2Id },
        {
          user1Id: user2Id,
          user2Id: user1Id,
        },
      ],
    });

    if (!room) {
      room = this.chatRoomRepo.create({ user1Id, user2Id });
      await this.chatRoomRepo.save(room);
    }
    return room;
  }

  async sendMessage(chatRoomId: string, senderId: string, content: string) {
    const message = this.messageRepo.create({ chatRoomId, senderId, content });
    await this.messageRepo.save(message);
    return message;
  }

  async getMessages(chatRoomId: string, limit = 50) {
    return this.messageRepo.find({
      where: { chatRoomId },
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }
}
