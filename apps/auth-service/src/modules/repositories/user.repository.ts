import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  createUser(data: {
    email: string;
    username: string;
    password: string;
    cpf: string;
    birth_date: Date;
  }): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<void> {
    await this.repo.update(userId, data);
  }

  updateRefreshToken(userId: string, hash: string | null) {
    return this.repo.update(userId, {
      refreshTokenHash: hash ?? undefined,
    });
  }
}
