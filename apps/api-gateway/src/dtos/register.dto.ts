import {
  IsEmail,
  IsString,
  MinLength,
  IsDate,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AuthRegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @MinLength(6)
  @IsNotEmpty()
  confirm_password: string;

  @MinLength(11)
  @IsNotEmpty()
  cpf: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birth_date: Date;
}
