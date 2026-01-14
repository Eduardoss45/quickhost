import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/types';
import { ChatService } from './chat.service';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send-message')
  async sendMessage(
    @CurrentUser() user: JwtUser,
    @Body() body: { chatRoomId: string; content: string },
  ) {
    return this.chatService.sendMessage({
      chatRoomId: body.chatRoomId,
      content: body.content,
      senderId: user.userId,
    });
  }

  @Post('room')
  async getOrCreateRoom(
    @CurrentUser() user: JwtUser,
    @Body() body: { user2Id: string },
  ) {
    return this.chatService.getOrCreateRoom({
      user1Id: user.userId,
      user2Id: body.user2Id,
    });
  }

  @Get('room/:roomId/messages')
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages({
      chatRoomId: roomId,
    });
  }

  @Get('rooms')
  async getMyRooms(@CurrentUser() user: JwtUser) {
    return this.chatService.getUserRooms({
      userId: user.userId,
    });
  }
}
