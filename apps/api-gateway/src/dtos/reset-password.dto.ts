import { IsNotEmpty, MinLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description:
      'Token de redefinição de senha (UUID, válido por até 5 minutos)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Nova senha do usuário (mínimo de 6 caracteres)',
    minLength: 6,
    example: 'novaSenha123',
  })
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Confirmação da nova senha',
    minLength: 6,
    example: 'novaSenha123',
  })
  @MinLength(6)
  @IsNotEmpty()
  confirm_password: string;
}
