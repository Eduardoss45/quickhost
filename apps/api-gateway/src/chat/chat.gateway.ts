import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
})
export class ChatGateway {
  @WebSocketServer()
  server!: any;

  private readonly userSockets = new Map<string, Set<string>>();

  constructor(
    @Inject('CHAT_CLIENT')
    private readonly chatClient: ClientProxy,
  ) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId;
    if (!userId) return client.disconnect();

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(client.id);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth?.userId;
    if (!userId) return;

    const set = this.userSockets.get(userId);
    set?.delete(client.id);

    if (set?.size === 0) {
      this.userSockets.delete(userId);
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
    @MessageBody() payload: { chatRoomId: string; content: string },
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

  async emitToRoom(roomId: string, message: any) {
    this.server.to(roomId).emit('chat.message', message);

    const participants: string[] = await firstValueFrom(
      this.chatClient.send('chat.get_room_participants', {
        chatRoomId: roomId,
      }),
    );

    for (const userId of participants) {
      if (userId === message.senderId) continue;

      const sockets = this.userSockets.get(userId);
      if (!sockets) continue;

      for (const socketId of sockets) {
        const socket = this.server.sockets.get(socketId);
        if (!socket) continue;

        if (!socket.rooms.has(roomId)) {
          socket.emit('chat.notification', {
            roomId,
            preview: message.content.slice(0, 60),
            deliveredAt: new Date().toISOString(),
          });
        }
      }
    }
  }

  emitToUser(userId: string, payload: any) {
    const sockets = this.userSockets.get(userId);
    if (!sockets) return;

    for (const socketId of sockets) {
      const socket = this.server.sockets.get(socketId);
      socket?.emit('chat.notification', payload);
    }
  }
}
