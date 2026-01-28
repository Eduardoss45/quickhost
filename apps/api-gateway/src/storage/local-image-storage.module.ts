import { Module } from '@nestjs/common';
import { LocalImageStorageService } from './local-image-storage.service';

@Module({
  providers: [LocalImageStorageService],
  exports: [LocalImageStorageModule],
})
export class LocalImageStorageModule {}
