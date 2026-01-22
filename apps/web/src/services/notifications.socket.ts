import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectNotifications() {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_API_BASE_URL + '/notifications', {
    transports: ['websocket'],
    withCredentials: true,
  });

  return socket;
}

export function disconnectNotifications() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
