import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { differenceInYears } from 'date-fns';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDto } from '../dtos';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(private readonly users: UserRepository) {}

  async updateProfile(userId: string, dto: UpdateUserDto) {
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

    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.birth_date) {
      const age = differenceInYears(new Date(), new Date(dto.birth_date));
      if (age < 18) {
        throw new RpcException({
          statusCode: 400,
          message: 'Usuário deve ter no mínimo 18 anos',
        });
      }
      updateData.birth_date = new Date(dto.birth_date);
    }

    if (dto.social_name !== undefined) updateData.social_name = dto.social_name;

    if (dto.phone_number !== undefined)
      updateData.phone_number = dto.phone_number;

    if (dto.profile_picture_url !== undefined)
      updateData.profile_picture_url = dto.profile_picture_url;

    await this.users.updateProfile(userId, updateData);
  }
}
