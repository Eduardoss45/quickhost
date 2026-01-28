jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    mkdir: jest.fn(),
    writeFile: jest.fn(),
    unlink: jest.fn(),
    rm: jest.fn(),
    readdir: jest.fn(),
  },
}));

jest.mock('sharp', () =>
  jest.fn(() => ({
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    toBuffer: jest.fn(),
  })),
);

import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from '../media.service';
import { BadRequestException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import * as fs from 'fs';
import sharp from 'sharp';

describe('MediaService', () => {
  let service: MediaService;
  let authClient: jest.Mocked<ClientProxy>;
  let accommodationClient: jest.Mocked<ClientProxy>;

  const validBuffer = Buffer.from('image');

  beforeEach(async () => {
    jest.clearAllMocks();

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => undefined);
    (fs.promises.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);
    (fs.promises.rm as jest.Mock).mockResolvedValue(undefined);

    (sharp as unknown as jest.Mock).mockReturnValue({
      resize: jest.fn().mockReturnThis(),
      jpeg: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(validBuffer),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: 'AUTH_CLIENT',
          useValue: { send: jest.fn() },
        },
        {
          provide: 'ACCOMMODATIONS_CLIENT',
          useValue: { send: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(MediaService);
    authClient = module.get('AUTH_CLIENT');
    accommodationClient = module.get('ACCOMMODATIONS_CLIENT');
  });

  describe('processUserProfileImage', () => {
    it('should process raw user profile image', async () => {
      (fs.promises.readdir as jest.Mock).mockResolvedValue(['raw.jpg']);

      const result = await service.processUserProfileImage('user-id');

      expect(fs.promises.writeFile).toHaveBeenCalled();
      expect(fs.promises.rm).toHaveBeenCalled();
      expect(result).toBe('/uploads/users/user-id/profile.jpeg');
    });

    it('should throw RpcException if no raw images exist', async () => {
      (fs.promises.readdir as jest.Mock).mockResolvedValue([]);

      await expect(
        service.processUserProfileImage('user-id'),
      ).rejects.toBeInstanceOf(RpcException);
    });
  });

  describe('removeUserProfileImage', () => {
    it('should remove profile image if exists', async () => {
      await service.removeUserProfileImage(
        'user-id',
        '/uploads/users/user-id/profile.jpeg',
      );

      expect(fs.promises.unlink).toHaveBeenCalled();
    });

    it('should throw RpcException on failure', async () => {
      (fs.promises.unlink as jest.Mock).mockRejectedValueOnce(new Error());

      await expect(
        service.removeUserProfileImage(
          'user-id',
          '/uploads/users/user-id/profile.jpeg',
        ),
      ).rejects.toBeInstanceOf(RpcException);
    });
  });

  describe('processAccommodationImages', () => {
    it('should process accommodation images and return cover', async () => {
      (fs.promises.readdir as jest.Mock).mockResolvedValue(['1.jpg', '2.jpg']);

      const result = await service.processAccommodationImages('acc-id');

      expect(result.cover).toContain('image0.jpeg');
      expect(result.images).toHaveLength(2);
      expect(fs.promises.writeFile).toHaveBeenCalledTimes(2);
      expect(fs.promises.rm).toHaveBeenCalled();
    });

    it('should reject invalid image count', async () => {
      (fs.promises.readdir as jest.Mock).mockResolvedValue([]);

      await expect(
        service.processAccommodationImages('acc-id'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('removeAccommodationImages', () => {
    it('should remove accommodation directory', async () => {
      await service.removeAccommodationImages('acc-id');

      expect(fs.promises.rm).toHaveBeenCalled();
    });

    it('should throw RpcException on failure', async () => {
      (fs.promises.rm as jest.Mock).mockRejectedValueOnce(new Error());

      await expect(
        service.removeAccommodationImages('acc-id'),
      ).rejects.toBeInstanceOf(RpcException);
    });
  });

  describe('userExists', () => {
    it('should return true if user exists', async () => {
      authClient.send.mockReturnValue(of({}));

      const result = await service.userExists('user-id');

      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      authClient.send.mockReturnValue(throwError(() => new Error()));

      const result = await service.userExists('user-id');

      expect(result).toBe(false);
    });
  });

  describe('accommodationExists', () => {
    it('should return true if accommodation exists', async () => {
      accommodationClient.send.mockReturnValue(of({}));

      const result = await service.accommodationExists('acc-id');

      expect(result).toBe(true);
    });

    it('should return false if accommodation does not exist', async () => {
      accommodationClient.send.mockReturnValue(throwError(() => new Error()));

      const result = await service.accommodationExists('acc-id');

      expect(result).toBe(false);
    });
  });

  describe('cleanupUserUploads', () => {
    it('should remove invalid user directories', async () => {
      (fs.promises.readdir as jest.Mock).mockResolvedValue([
        { name: 'invalid', isDirectory: () => true },
      ]);

      jest.spyOn(service as any, 'userExists').mockResolvedValue(false);

      await service.cleanupUserUploads();

      expect(fs.promises.rm).toHaveBeenCalled();
    });
  });

  describe('cleanupAccommodationUploads', () => {
    it('should remove invalid accommodation directories', async () => {
      (fs.promises.readdir as jest.Mock).mockResolvedValue([
        { name: 'invalid', isDirectory: () => true },
      ]);

      jest
        .spyOn(service as any, 'accommodationExists')
        .mockResolvedValue(false);

      await service.cleanupAccommodationUploads();

      expect(fs.promises.rm).toHaveBeenCalled();
    });
  });
});
