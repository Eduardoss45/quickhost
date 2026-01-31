import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetOrCreateRoomDto {
  @ApiProperty({
    description: 'ID do outro usuário da conversa',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  user2Id: string;
}
