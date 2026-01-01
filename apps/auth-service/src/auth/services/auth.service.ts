import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly users: UserRepository) {}

  async register(data: { email: string; username: string; password: string }) {
    const exists = await this.users.findByEmail(data.email);

    if (exists) {
      throw new RpcException({
        statusCode: 409,
        message: 'Email already in use',
      });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.users.createUser({
      email: data.email,
      username: data.username,
      password: passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.users.findByEmailWithPassword(data.email);

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const valid = await bcrypt.compare(data.password, user.password);

    if (!valid) {
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid credentials',
      });
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
