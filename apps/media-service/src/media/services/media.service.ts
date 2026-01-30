import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';
import sharp from 'sharp';
import { validate as isUUID } from 'uuid';

@Injectable()
export class MediaService {
  private readonly uploadDir: string;

  private isValidUUID(value: string): boolean {
    return isUUID(value);
  }

  private getUploadsPath(): string {
    const root = process.env.PROJECT_ROOT;
    if (!root) {
      throw new Error('PROJECT_ROOT environment variable is not defined');
    }
    return path.resolve(root, 'uploads');
  }

  constructor(
    @Inject('ACCOMMODATIONS_CLIENT')
    private readonly accommodationClient: ClientProxy,
    @Inject('AUTH_CLIENT')
    private readonly authClient: ClientProxy,
  ) {
    this.uploadDir = this.getUploadsPath();

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async processUserProfileImage(userId: string): Promise<string> {
    const rawDir = path.join(this.uploadDir, 'users', userId, 'raw');
    const finalDir = path.join(this.uploadDir, 'users', userId);

    const files = await fs.promises.readdir(rawDir);
    if (files.length === 0) {
      throw new RpcException('Nenhuma imagem raw encontrada');
    }

    const rawFile = path.join(rawDir, files[0]);

    await fs.promises.mkdir(finalDir, { recursive: true });

    const buffer = await sharp(rawFile)
      .resize({ width: 800, withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    const finalPath = path.join(finalDir, 'profile.jpeg');
    await fs.promises.writeFile(finalPath, buffer);

    await fs.promises.rm(rawDir, { recursive: true, force: true });

    return `/uploads/users/${userId}/profile.jpeg`;
  }

  async removeUserProfileImage(userId: string, imagePath: string) {
    try {
      const filePath = path.join(
        this.uploadDir,
        imagePath.replace('/uploads/', ''),
      );

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }

      return { success: true };
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Erro ao remover imagem',
      });
    }
  }

  async processAccommodationImages(
    accommodationId: string,
  ): Promise<{ cover: string; images: string[] }> {
    const baseDir = path.join(
      this.uploadDir,
      'accommodations',
      accommodationId,
    );
    const rawDir = path.join(baseDir, 'raw');

    if (!fs.existsSync(rawDir)) {
      throw new RpcException('Nenhuma imagem raw encontrada');
    }

    const files = (await fs.promises.readdir(rawDir)).sort();

    if (files.length === 0 || files.length > 5) {
      throw new BadRequestException('Quantidade inválida de imagens');
    }

    await fs.promises.mkdir(baseDir, { recursive: true });

    const finalImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const rawPath = path.join(rawDir, files[i]);

      const buffer = await sharp(rawPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toBuffer();

      const filename = `image${i}.jpeg`;
      const finalPath = path.join(baseDir, filename);

      await fs.promises.writeFile(finalPath, buffer);

      finalImages.push(
        `/uploads/accommodations/${accommodationId}/${filename}`,
      );
    }

    await fs.promises.rm(rawDir, { recursive: true, force: true });

    return {
      cover: finalImages[0],
      images: finalImages,
    };
  }

  async removeAccommodationImages(accommodationId: string) {
    const dir = path.join(this.uploadDir, 'accommodations', accommodationId);

    if (!fs.existsSync(dir)) return;

    try {
      await fs.promises.rm(dir, { recursive: true, force: true });
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Erro ao remover imagens da acomodação',
      });
    }
  }

  async userExists(userId: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.authClient.send('user.get_public_profile', { userId }),
      );
      return true;
    } catch {
      return false;
    }
  }

  async accommodationExists(accommodationId: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.accommodationClient.send(
          'accommodation.find_one',
          accommodationId,
        ),
      );
      return true;
    } catch {
      return false;
    }
  }

  async cleanupUserUploads(): Promise<void> {
    const usersDir = path.join(this.uploadDir, 'users');
    if (!fs.existsSync(usersDir)) return;

    const entries = await fs.promises.readdir(usersDir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const userId = entry.name;
      const dirPath = path.join(usersDir, userId);

      try {
        if (!this.isValidUUID(userId) || !(await this.userExists(userId))) {
          await fs.promises.rm(dirPath, { recursive: true, force: true });
        }
      } catch (error) {}
    }
  }

  async cleanupAccommodationUploads(): Promise<void> {
    const accDir = path.join(this.uploadDir, 'accommodations');
    if (!fs.existsSync(accDir)) return;

    const entries = await fs.promises.readdir(accDir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const accommodationId = entry.name;
      const dirPath = path.join(accDir, accommodationId);

      try {
        if (
          !this.isValidUUID(accommodationId) ||
          !(await this.accommodationExists(accommodationId))
        ) {
          await fs.promises.rm(dirPath, { recursive: true, force: true });
        }
      } catch (error) {}
    }
  }
}
