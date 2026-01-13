import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { differenceInYears } from 'date-fns';
import { UserRepository } from '../../repositories/user.repository';
import { UpdateUserDto } from '../../dtos';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private readonly users: UserRepository,
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
  ) {}

  async updateProfile(
    userId: string,
    dto: UpdateUserDto,
    file?: {
      buffer: string;
      originalName: string;
      mimetype: string;
    },
  ) {
    const user = await this.users.findById(userId);
    if (!user)
      throw new RpcException({
        statusCode: 404,
        message: 'Usuário não encontrado',
      });

    const updateData: Partial<User> = {};

    if (dto.username) {
      const exists = await this.users.findByUsername(dto.username);
      if (exists && exists.id !== userId)
        throw new RpcException({
          statusCode: 400,
          message: 'Username já está em uso',
        });
      updateData.username = dto.username;
    }

    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.birth_date) {
      const age = differenceInYears(new Date(), new Date(dto.birth_date));
      if (age < 18)
        throw new RpcException({
          statusCode: 400,
          message: 'Usuário deve ter no mínimo 18 anos',
        });
      updateData.birth_date = new Date(dto.birth_date);
    }

    if (dto.social_name !== undefined) updateData.social_name = dto.social_name;
    if (dto.phone_number !== undefined)
      updateData.phone_number = dto.phone_number;

    if (file) {
      try {
        console.log('AuthService → Recebeu base64 size:', file.buffer.length);

        const imageUrl = await firstValueFrom(
          this.mediaClient.send<string>('upload_profile_image', {
            fileBuffer: file.buffer, // já é base64
            originalName: file.originalName,
          }),
        );

        updateData.profile_picture_url = imageUrl;
      } catch (err) {
        console.log('❌ Erro do Media Service recebido no Auth Service:', err);

        if (
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as any).response === 'object'
        ) {
          const response = (err as any).response;
          if ('statusCode' in response && 'message' in response) {
            throw new RpcException({
              statusCode: response.statusCode,
              message: response.message,
            });
          }
        }

        throw new RpcException({
          statusCode: 500,
          message: 'Erro ao processar imagem',
        });
      }
    }

    await this.users.updateProfile(userId, updateData);

    return {
      success: true,
      message: 'Perfil atualizado com sucesso',
    };
  }
}
