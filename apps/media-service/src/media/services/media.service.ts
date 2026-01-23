import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
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

  constructor(
    @Inject('ACCOMMODATIONS_CLIENT')
    private readonly accommodationClient: ClientProxy,
    @Inject('AUTH_CLIENT')
    private readonly authClient: ClientProxy,
  ) {
    this.uploadDir = path.resolve(process.cwd(), '..', '..', 'uploads');

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadUserProfileImage(
    userId: string,
    fileBuffer: Buffer,
    originalName: string,
  ): Promise<string> {
    if (!fileBuffer || fileBuffer.length < 10) {
      throw new BadRequestException('Arquivo inválido ou corrompido');
    }

    const maxSize = 5 * 1024 * 1024;
    if (fileBuffer.length > maxSize) {
      throw new BadRequestException('Arquivo maior que 5 MB');
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(originalName).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException('Formato de imagem não suportado');
    }

    const userDir = path.join(this.uploadDir, 'users', userId);

    await fs.promises.mkdir(userDir, { recursive: true });

    const filepath = path.join(userDir, 'profile.jpeg');

    try {
      const resizedBuffer = await sharp(fileBuffer)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toBuffer();

      await fs.promises.writeFile(filepath, resizedBuffer);

      return `/uploads/users/${userId}/profile.jpeg`;
    } catch {
      throw new InternalServerErrorException('Erro ao salvar imagem');
    }
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

  async uploadAccommodationImages(
    accommodationId: string,
    images: {
      fileBuffer: Buffer;
      originalName: string;
    }[],
    coverOriginalName: string,
  ): Promise<{
    cover: string;
    images: string[];
  }> {
    if (images.length === 0 || images.length > 5) {
      throw new BadRequestException('Acomodação deve ter entre 1 e 5 imagens');
    }

    const coverIndex = images.findIndex(
      (img) => img.originalName === coverOriginalName,
    );

    if (coverIndex === -1) {
      throw new BadRequestException('Imagem de capa não encontrada');
    }

    const orderedImages = [
      images[coverIndex],
      ...images.filter((_, i) => i !== coverIndex),
    ];

    const dir = path.join(this.uploadDir, 'accommodations', accommodationId);

    await fs.promises.mkdir(dir, { recursive: true });

    const savedImages: string[] = [];

    for (let i = 0; i < orderedImages.length; i++) {
      const img = orderedImages[i];

      const buffer = await sharp(img.fileBuffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toBuffer();

      const filename = `image${i}.jpeg`;
      const filepath = path.join(dir, filename);

      await fs.promises.writeFile(filepath, buffer);

      savedImages.push(
        `/uploads/accommodations/${accommodationId}/${filename}`,
      );
    }

    return {
      cover: savedImages[0],
      images: savedImages,
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
