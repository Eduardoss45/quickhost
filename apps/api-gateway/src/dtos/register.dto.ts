import {
  IsEmail,
  IsString,
  MinLength,
  IsDate,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'test@test.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Nome de usuário',
    example: 'Eduardo souza',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo de 6 caracteres)',
    minLength: 6,
    example: '123456',
  })
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Confirmação da senha (deve ser igual à senha)',
    minLength: 6,
    example: '123456',
  })
  @MinLength(6)
  @IsNotEmpty()
  confirm_password: string;

  @ApiProperty({
    description: 'CPF do usuário (somente números)',
    minLength: 11,
    example: '12345678901',
  })
  @MinLength(11)
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({
    description: 'Data de nascimento',
    example: '2000-05-20',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birth_date: Date;
}
