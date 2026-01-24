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

jest.mock('sharp', () => {
  return jest.fn(() => ({
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    toBuffer: jest.fn(),
  }));
});

import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from '../media.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { of, throwError } from 'rxjs';
import * as fs from 'fs';
import sharp from 'sharp';
import * as path from 'path';

describe('MediaService', () => {
  let service: MediaService;
  let authClient: jest.Mocked<ClientProxy>;
  let accommodationClient: jest.Mocked<ClientProxy>;

  const validBuffer = Buffer.from('a'.repeat(100));
  const imageName = 'photo.jpg';

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

  describe('uploadUserProfileImage', () => {
    it('should upload and resize user profile image', async () => {
      const result = await service.uploadUserProfileImage(
        'user-id',
        validBuffer,
        imageName,
      );

      expect(fs.promises.mkdir).toHaveBeenCalled();
      expect(fs.promises.writeFile).toHaveBeenCalled();
      expect(result).toBe('/uploads/users/user-id/profile.jpeg');
    });

    it('should reject invalid buffer', async () => {
      await expect(
        service.uploadUserProfileImage('u1', Buffer.from('a'), imageName),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should reject unsupported extension', async () => {
      await expect(
        service.uploadUserProfileImage('u1', validBuffer, 'file.txt'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw error if sharp fails', async () => {
      (sharp as unknown as jest.Mock).mockReturnValueOnce({
        resize: jest.fn().mockReturnThis(),
        jpeg: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockRejectedValue(new Error()),
      });

      await expect(
        service.uploadUserProfileImage('u1', validBuffer, imageName),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('removeUserProfileImage', () => {
    it('should remove image if exists', async () => {
      const result = await service.removeUserProfileImage(
        'u1',
        '/uploads/users/u1/profile.jpeg',
      );

      expect(fs.promises.unlink).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it('should throw RpcException on failure', async () => {
      (fs.promises.unlink as jest.Mock).mockRejectedValueOnce(new Error());

      await expect(
        service.removeUserProfileImage('u1', '/uploads/users/u1/profile.jpeg'),
      ).rejects.toBeInstanceOf(RpcException);
    });
  });

  describe('uploadAccommodationImages', () => {
    it('should upload accommodation images with cover', async () => {
      const images = [
        { fileBuffer: validBuffer, originalName: 'cover.jpg' },
        { fileBuffer: validBuffer, originalName: '2.jpg' },
      ];

      const result = await service.uploadAccommodationImages(
        'acc-id',
        images,
        'cover.jpg',
      );

      expect(result.cover).toContain('image0.jpeg');
      expect(result.images).toHaveLength(2);
      expect(fs.promises.writeFile).toHaveBeenCalledTimes(2);
    });

    it('should reject when cover not found', async () => {
      await expect(
        service.uploadAccommodationImages(
          'acc-id',
          [{ fileBuffer: validBuffer, originalName: '1.jpg' }],
          'cover.jpg',
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should reject invalid image count', async () => {
      await expect(
        service.uploadAccommodationImages('acc-id', [], 'x.jpg'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('removeAccommodationImages', () => {
    it('should remove directory if exists', async () => {
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

      const result = await service.userExists('u1');

      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      authClient.send.mockReturnValue(throwError(() => new Error()));

      const result = await service.userExists('u1');

      expect(result).toBe(false);
    });
  });

  describe('accommodationExists', () => {
    it('should return true if accommodation exists', async () => {
      accommodationClient.send.mockReturnValue(of({}));

      const result = await service.accommodationExists('a1');

      expect(result).toBe(true);
    });

    it('should return false if accommodation does not exist', async () => {
      accommodationClient.send.mockReturnValue(throwError(() => new Error()));

      const result = await service.accommodationExists('a1');

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
