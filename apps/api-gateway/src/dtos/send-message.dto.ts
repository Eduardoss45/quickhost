import { IsUUID, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: 'ID da sala de chat',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  chatRoomId: string;

  @ApiProperty({
    description: 'Conteúdo da mensagem',
    example: 'Olá, ainda está disponível?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
