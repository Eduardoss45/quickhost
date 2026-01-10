import { AuthRegisterDto } from '../dtos';

export type RegisterCommand = AuthRegisterDto & {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  cpf: string;
  birth_date: Date;
};
