import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { JwtUser } from 'src/types';
import { ChatService } from './chat.service';
import { SendMessageDto, GetOrCreateRoomDto } from '../dtos';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send-message')
  @ApiOperation({ summary: 'Enviar mensagem em uma sala de chat' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Mensagem enviada com sucesso',
  })
  async sendMessage(@CurrentUser() user: JwtUser, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage({
      chatRoomId: dto.chatRoomId,
      content: dto.content,
      senderId: user.userId,
    });
  }

  @Post('room')
  @ApiOperation({
    summary: 'Criar ou recuperar uma sala de chat entre dois usuários',
  })
  @ApiBody({ type: GetOrCreateRoomDto })
  @ApiResponse({
    status: 200,
    description: 'Sala de chat retornada ou criada',
  })
  async getOrCreateRoom(
    @CurrentUser() user: JwtUser,
    @Body() dto: GetOrCreateRoomDto,
  ) {
    return this.chatService.getOrCreateRoom({
      user1Id: user.userId,
      user2Id: dto.user2Id,
    });
  }

  @Get('room/:roomId/messages')
  @ApiOperation({
    summary: 'Listar mensagens de uma sala de chat',
  })
  @ApiParam({
    name: 'roomId',
    description: 'ID da sala de chat',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de mensagens da sala',
  })
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages({
      chatRoomId: roomId,
    });
  }

  @Get('rooms')
  @ApiOperation({
    summary: 'Listar salas de chat do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de salas de chat do usuário',
  })
  async getMyRooms(@CurrentUser() user: JwtUser) {
    return this.chatService.getUserRooms({
      userId: user.userId,
    });
  }
}
