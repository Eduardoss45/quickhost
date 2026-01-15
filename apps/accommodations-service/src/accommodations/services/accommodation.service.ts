import { RpcException } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { AccommodationRepository } from '../repositories/accommodation.repository';
import { Accommodation } from '../entities/accommodation.entity';

@Injectable()
export class AccommodationService {
  constructor(
    private readonly accommodationRepository: AccommodationRepository,
  ) {}

  async create(data: Partial<Accommodation>) {
    const accommodation = this.accommodationRepository.create(data);
    return this.accommodationRepository.save(accommodation);
  }

  async findAll() {
    return this.accommodationRepository.find();
  }

  async findOne(id: string) {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
    });

    if (!accommodation) {
      throw new RpcException({
        statusCode: 404,
        message: 'Acomodação não encontrada',
      });
    }

    return accommodation;
  }

  async findByCreator(creatorId: string) {
    return this.accommodationRepository.findByCreatorId(creatorId);
  }

  async update(id: string, data: Partial<Accommodation>, userId: string) {
    const accommodation = await this.findOne(id);

    if (accommodation.creator_id !== userId) {
      throw new RpcException({
        statusCode: 403,
        message: 'Você não tem permissão para editar esta acomodação',
      });
    }

    Object.assign(accommodation, data);

    return this.accommodationRepository.save(accommodation);
  }

  async remove(id: string) {
    const accommodation = await this.findOne(id);
    await this.accommodationRepository.remove(accommodation);
  }
}
