import { Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject('CHAT_CLIENT')
    private readonly chatClient: ClientProxy,
  ) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId;
    if (!userId) {
      client.disconnect();
    }
  }

  @SubscribeMessage('chat.join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatRoomId: string },
  ) {
    client.join(payload.chatRoomId);
  }

  @SubscribeMessage('chat.send')
  async handleSend(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { chatRoomId: string; content: string },
  ) {
    const senderId = client.handshake.auth.userId;

    await firstValueFrom(
      this.chatClient.send('chat.send_message', {
        chatRoomId: payload.chatRoomId,
        senderId,
        content: payload.content,
      }),
    );
  }

  @MessagePattern('chat.message.created')
  handleMessageCreated(message: any) {
    this.server.to(message.chatRoomId).emit('chat.message', message);
  }

  emitToRoom(roomId: string, message: any) {
    this.server.to(roomId).emit('chat.message', message);
  }
}
