import { RpcException } from '@nestjs/microservices';

export function mapDatabaseError(error: any): never {
  if (error?.code === '23505') {
    if (error.detail?.includes('cpf'))
      throw new RpcException({ statusCode: 409, message: 'CPF já cadastrado' });

    if (error.detail?.includes('email'))
      throw new RpcException({
        statusCode: 409,
        message: 'Email já cadastrado',
      });

    if (error.detail?.includes('username'))
      throw new RpcException({
        statusCode: 409,
        message: 'Username já cadastrado',
      });

    throw new RpcException({ statusCode: 409, message: 'Registro duplicado' });
  }

  throw new RpcException({
    statusCode: 500,
    message: 'Erro interno no banco de dados',
  });
}
