import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatService } from '../chat.service';
import { ChatRoom } from '../../entities/chat-room.entity';
import { Message } from '../../entities/message.entity';
import { ClientProxy } from '@nestjs/microservices';

describe('ChatService', () => {
  let service: ChatService;
  let chatRoomRepo: jest.Mocked<Repository<ChatRoom>>;
  let messageRepo: jest.Mocked<Repository<Message>>;
  let gatewayClient: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(ChatRoom),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Message),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: 'CHAT_GATEWAY_CLIENT',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ChatService);
    chatRoomRepo = module.get(getRepositoryToken(ChatRoom));
    messageRepo = module.get(getRepositoryToken(Message));
    gatewayClient = module.get('CHAT_GATEWAY_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrCreateRoom', () => {
    it('should return existing room if found', async () => {
      const room = { id: 'room-1', user1Id: 'u1', user2Id: 'u2' } as ChatRoom;

      chatRoomRepo.findOne.mockResolvedValue(room);

      const result = await service.getOrCreateRoom('u1', 'u2');

      expect(chatRoomRepo.findOne).toHaveBeenCalled();
      expect(chatRoomRepo.create).not.toHaveBeenCalled();
      expect(result).toBe(room);
    });

    it('should create and save room if not found', async () => {
      const room = { id: 'room-1', user1Id: 'u1', user2Id: 'u2' } as ChatRoom;

      chatRoomRepo.findOne.mockResolvedValue(null);
      chatRoomRepo.create.mockReturnValue(room);
      chatRoomRepo.save.mockResolvedValue(room);

      const result = await service.getOrCreateRoom('u1', 'u2');

      expect(chatRoomRepo.create).toHaveBeenCalledWith({
        user1Id: 'u1',
        user2Id: 'u2',
      });
      expect(chatRoomRepo.save).toHaveBeenCalledWith(room);
      expect(result).toBe(room);
    });
  });

  describe('sendMessage', () => {
    it('should create, save and emit message', async () => {
      const message = {
        id: 'msg-1',
        chatRoomId: 'room-1',
        senderId: 'u1',
        content: 'Hello',
      } as Message;

      messageRepo.create.mockReturnValue(message);
      messageRepo.save.mockResolvedValue(message);

      const result = await service.sendMessage('room-1', 'u1', 'Hello');

      expect(messageRepo.create).toHaveBeenCalledWith({
        chatRoomId: 'room-1',
        senderId: 'u1',
        content: 'Hello',
      });
      expect(messageRepo.save).toHaveBeenCalledWith(message);
      expect(gatewayClient.emit).toHaveBeenCalledWith(
        'chat.message.created',
        message,
      );
      expect(result).toBe(message);
    });
  });

  describe('getMessages', () => {
    it('should return messages ordered by createdAt', async () => {
      const messages = [{ id: 'm1' }, { id: 'm2' }] as Message[];

      messageRepo.find.mockResolvedValue(messages);

      const result = await service.getMessages('room-1', 20);

      expect(messageRepo.find).toHaveBeenCalledWith({
        where: { chatRoomId: 'room-1' },
        order: { createdAt: 'ASC' },
        take: 20,
      });
      expect(result).toEqual(messages);
    });

    it('should use default limit when not provided', async () => {
      messageRepo.find.mockResolvedValue([]);

      await service.getMessages('room-1');

      expect(messageRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ take: 50 }),
      );
    });
  });

  describe('getUserRooms', () => {
    it('should return mapped rooms with otherUserId', async () => {
      const rooms = [
        { id: 'r1', user1Id: 'u1', user2Id: 'u2' },
        { id: 'r2', user1Id: 'u3', user2Id: 'u1' },
      ] as ChatRoom[];

      chatRoomRepo.find.mockResolvedValue(rooms);

      const result = await service.getUserRooms('u1');

      expect(chatRoomRepo.find).toHaveBeenCalledWith({
        where: [{ user1Id: 'u1' }, { user2Id: 'u1' }],
      });

      expect(result).toEqual([
        { roomId: 'r1', otherUserId: 'u2' },
        { roomId: 'r2', otherUserId: 'u3' },
      ]);
    });
  });

  describe('getRoomParticipants', () => {
    it('should return empty array if room does not exist', async () => {
      chatRoomRepo.findOneBy.mockResolvedValue(null);

      const result = await service.getRoomParticipants('room-1');

      expect(result).toEqual([]);
    });

    it('should return both participant ids', async () => {
      const room = {
        id: 'room-1',
        user1Id: 'u1',
        user2Id: 'u2',
      } as ChatRoom;

      chatRoomRepo.findOneBy.mockResolvedValue(room);

      const result = await service.getRoomParticipants('room-1');

      expect(result).toEqual(['u1', 'u2']);
    });
  });
});
