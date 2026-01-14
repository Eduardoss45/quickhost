import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SendMessageDto } from '../dtos/send-message.dto';
import { GetOrCreateRoomDto } from '../dtos/get-or-create-room.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(@Inject('CHAT_CLIENT') private chatClient: ClientProxy) {}

  async sendMessage(dto: SendMessageDto) {
    return firstValueFrom(this.chatClient.send('chat.send_message', dto));
  }

  async getOrCreateRoom(dto: GetOrCreateRoomDto) {
    return firstValueFrom(this.chatClient.send('chat.get_or_create_room', dto));
  }
}
