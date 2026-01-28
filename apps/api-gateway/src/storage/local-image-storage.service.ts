import { Injectable, BadRequestException } from '@nestjs/common';
import path from 'path';
import fs from 'fs';

@Injectable()
export class LocalImageStorageService {
  private baseUploads = path.resolve(
    process.env.PROJECT_ROOT ??
      (() => {
        throw new Error('PROJECT_ROOT not defined');
      })(),
    'uploads',
  );

  async saveRawUserProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const dir = path.join(this.baseUploads, 'users', userId, 'raw');
    await fs.promises.mkdir(dir, { recursive: true });

    const ext = path.extname(file.originalname) || '.bin';
    const filename = `profile${ext}`;

    const filepath = path.join(dir, filename);
    await fs.promises.writeFile(filepath, file.buffer);

    return `/uploads/users/${userId}/raw/${filename}`;
  }

  async saveRawAccommodationImages(
    accommodationId: string,
    files: Express.Multer.File[],
    coverOriginalName: string,
  ) {
    if (files.length === 0 || files.length > 5) {
      throw new BadRequestException(
        'Acomodação deve conter entre 1 e 5 imagens',
      );
    }

    const coverIndex = files.findIndex(
      (f) => f.originalname === coverOriginalName,
    );

    if (coverIndex === -1) {
      throw new BadRequestException('Imagem de capa não encontrada');
    }

    const ordered = [
      files[coverIndex],
      ...files.filter((_, i) => i !== coverIndex),
    ];

    const dir = path.join(
      this.baseUploads,
      'accommodations',
      accommodationId,
      'raw',
    );

    await fs.promises.mkdir(dir, { recursive: true });

    const images: string[] = [];

    for (let i = 0; i < ordered.length; i++) {
      const ext = path.extname(ordered[i].originalname) || '.bin';
      const filename = `image${i}${ext}`;

      const filepath = path.join(dir, filename);
      await fs.promises.writeFile(filepath, ordered[i].buffer);

      images.push(`/uploads/accommodations/${accommodationId}/raw/${filename}`);
    }

    return {
      cover: images[0],
      images,
    };
  }
}
