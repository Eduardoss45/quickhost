import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private readonly corsOrigin: string | string[],
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    return super.createIOServer(port, {
      ...options,
      cors: {
        origin: this.corsOrigin,
        credentials: true,
      },
    });
  }
}
