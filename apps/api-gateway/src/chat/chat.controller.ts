import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/types';
import { ChatService } from './chat.service';
import { SendMessageDto } from '../dtos/send-message.dto';
import { GetOrCreateRoomDto } from '../dtos/get-or-create-room.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send-message')
  async sendMessage(
    @CurrentUser() user: JwtUser,
    @Body() dto: Omit<SendMessageDto, 'senderId'>,
  ) {
    return this.chatService.sendMessage({
      ...dto,
      senderId: user.userId,
    } as any);
  }

  @Post('room')
  async getOrCreateRoom(
    @CurrentUser() user: JwtUser,
    @Body() dto: Omit<GetOrCreateRoomDto, 'user1Id'>,
  ) {
    const backendDto = {
      user1Id: user.userId,
      user2Id: dto.user2Id,
    };

    return this.chatService.getOrCreateRoom(backendDto);
  }
}
