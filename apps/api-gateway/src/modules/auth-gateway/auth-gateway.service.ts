import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthGatewayService {
  registerAuthService() {
    return 'Novo usuário criado';
  }

  loginAuthService() {
    return 'Login realizado com sucesso';
  }

  logoutAuthService() {
    return 'Logout realizado com sucesso';
  }

  refreshAuthService() {
    return 'Token atualizado com sucesso';
  }

  forgotPasswordAuthService() {
    return 'Troca de senha solicitada';
  }

  resetPasswordAuthService() {
    return 'Senha trocada com sucesso';
  }
}
