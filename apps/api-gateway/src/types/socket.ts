import { JwtUser } from './jwt-user.interface';

declare module 'socket.io' {
  interface Socket {
    user?: JwtUser;
  }
}
