import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

@Injectable()
export class MediaService {
  private readonly uploadDir: string;

  constructor() {
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
}
