export type ChatMessagePayload = {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

export interface ChatRoom {
  roomId: string;
  otherUserId: string;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  createdAt: string;
}
