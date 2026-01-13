import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');

    console.log('📁 UploadDir real:', this.uploadDir);

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      console.log('📂 Pasta uploads criada com sucesso');
    }
  }

  async uploadProfileImage(
    fileBuffer: Buffer,
    originalName: string,
  ): Promise<string> {
    console.log('📥 uploadProfileImage chamado');
    console.log('📦 Buffer size:', fileBuffer?.length);
    console.log('📄 originalName:', originalName);

    if (!fileBuffer || fileBuffer.length < 10) {
      console.log('❌ Buffer inválido:', fileBuffer);
      throw new BadRequestException('Arquivo inválido ou corrompido');
    }

    const maxSize = 5 * 1024 * 1024;
    if (fileBuffer.length > maxSize) {
      throw new BadRequestException('Arquivo maior que 5 MB');
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(originalName).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Formato não suportado. Use: ${allowedExtensions.join(', ')}`,
      );
    }

    try {
      const resizedBuffer = await sharp(fileBuffer)
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 90 })
        .toBuffer();

      const filename = `${uuidv4()}.jpeg`;
      const filepath = path.join(this.uploadDir, filename);

      await fs.promises.writeFile(filepath, resizedBuffer);

      console.log('✅ Imagem salva em:', filepath);

      return `/uploads/${filename}`;
    } catch (err) {
      console.error('❌ Erro ao processar ou salvar imagem:', err);
      throw new InternalServerErrorException('Erro ao salvar a imagem');
    }
  }
}
