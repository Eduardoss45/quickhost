import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server!: Server;

  private readonly users = new Map<string, string>();

  constructor(private readonly jwtService: JwtService) {}

  onModuleInit() {
    this.server.use((socket, next) => {
      try {
        const rawCookie = socket.handshake.headers.cookie;
        if (!rawCookie) return next(new Error('No cookies provided'));

        const cookies = cookie.parse(rawCookie);
        const token = cookies['accessToken'];
        if (!token) return next(new Error('No token provided'));

        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });

        socket.data.user = {
          userId: payload.sub,
          email: payload.email,
          username: payload.username,
        };

        return next();
      } catch (err) {
        return next(new Error('Invalid token'));
      }
    });
  }

  handleConnection(client: Socket) {
    const user = client.data.user;

    if (!user) {
      client.disconnect();
      return;
    }

    this.users.set(user.userId, client.id);
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (!user) return;

    this.users.delete(user.userId);
  }

  emitToUser(userId: string, event: string, payload: any) {
    const socketId = this.users.get(userId);
    if (!socketId) return;

    this.server.to(socketId).emit(event, payload);
  }
}
