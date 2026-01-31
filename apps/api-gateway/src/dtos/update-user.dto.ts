import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nome social do usuário',
    example: 'Eduardo Souza',
  })
  @IsOptional()
  @IsString()
  social_name?: string;

  @ApiPropertyOptional({
    description: 'Nome de usuário',
    example: 'Eduardo souza',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'Nova senha do usuário',
    example: 'novaSenha123',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    description: 'CPF do usuário (somente números)',
    example: '12345678901',
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento (ISO 8601)',
    example: '2000-05-20',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @ApiPropertyOptional({
    description: 'Número de telefone',
    example: '+55 11 99999-9999',
  })
  @IsOptional()
  @IsString()
  phone_number?: string;
}
