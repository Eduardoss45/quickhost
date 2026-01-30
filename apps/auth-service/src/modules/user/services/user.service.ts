import { mapDatabaseError } from '../../common/errors/database-error.mapper';
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { differenceInYears, parse } from 'date-fns';
import { UserRepository } from '../../repositories/user.repository';
import { UpdateUserProfileDto } from '../../dtos';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { FavoritesRepository } from '../../repositories/favorites.repository';
import path from 'path';
import fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    private readonly users: UserRepository,
    private readonly favoritesRepo: FavoritesRepository,
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
  ) {}

  async updateProfile(userId: string, dto: UpdateUserProfileDto) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'Usuário não encontrado',
      });
    }

    const updateData: Partial<User> = {};

    if (dto.username) {
      const exists = await this.users.findByUsername(dto.username);
      if (exists && exists.id !== userId) {
        throw new RpcException({
          statusCode: 400,
          message: 'Username já está em uso',
        });
      }
      updateData.username = dto.username;
    }

    if (dto.birth_date) {
      const parsedDate = parse(dto.birth_date, 'yyyy-MM-dd', new Date());
      const age = differenceInYears(new Date(), parsedDate);

      if (age < 18) {
        throw new RpcException({
          statusCode: 400,
          message: 'Usuário deve ter no mínimo 18 anos',
        });
      }

      updateData.birth_date = parsedDate;
    }

    if (dto.social_name !== undefined) {
      updateData.social_name = dto.social_name;
    }

    if (dto.phone_number !== undefined) {
      updateData.phone_number = dto.phone_number;
    }

    if (dto.cpf !== undefined) {
      updateData.cpf = dto.cpf;
    }

    if (dto.remove_profile_picture === true) {
      updateData.profile_picture_url = null;
    }

    try {
      const imageUrl = await firstValueFrom(
        this.mediaClient.send<string>('process-user-profile-image', {
          userId,
        }),
      );

      updateData.profile_picture_url = imageUrl;
    } catch {
      throw new RpcException({
        statusCode: 500,
        message: 'Erro ao processar imagem de perfil',
      });
    }

    try {
      await this.users.updateProfile(userId, updateData);
    } catch (err) {
      mapDatabaseError(err);
    }

    return {
      success: true,
      message: 'Perfil atualizado com sucesso',
    };
  }

  async getProfile(userId: string) {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'Usuário não encontrado',
      });
    }

    const { password, refreshTokenHash, ...safeUser } = user;

    return safeUser;
  }

  async removeProfilePicture(userId: string) {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'Usuário não encontrado',
      });
    }

    if (!user.profile_picture_url) {
      return {
        success: true,
        message: 'Usuário não possui foto de perfil',
      };
    }

    await firstValueFrom(
      this.mediaClient.send('remove-profile-image', {
        userId,
        imagePath: user.profile_picture_url,
      }),
    );

    await this.users.updateProfile(userId, {
      profile_picture_url: null,
    });

    return {
      success: true,
      message: 'Foto de perfil removida',
    };
  }

  async getPublicUser(userId: string) {
    const user = await this.users.findPublicById(userId);

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'Usuário não encontrado',
      });
    }

    return user;
  }

  async add(userId: string, accommodationId: string): Promise<string> {
    try {
      await this.favoritesRepo.add(userId, accommodationId);
      return 'added';
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new RpcException({
          statusCode: 409,
          message: 'Acomodação já está nos favoritos',
        });
      }

      throw new RpcException({
        statusCode: 500,
        message: 'Erro ao adicionar favorito',
      });
    }
  }

  async remove(userId: string, accommodationId: string): Promise<void> {
    try {
      await this.favoritesRepo.remove(userId, accommodationId);
    } catch (err) {
      throw new RpcException({
        statusCode: 500,
        message: 'Erro ao remover favorito',
        detail: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  async listByUser(userId: string) {
    return this.favoritesRepo.listByUser(userId);
  }
}
