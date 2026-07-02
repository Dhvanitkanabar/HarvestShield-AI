import { FpoRepository } from '../repositories/fpo.repository.js';
import { AppError, formatPaginatedResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import type { CreateFpoInput, UpdateFpoInput, QueryFpoInput } from '../validators/fpo.validator.js';

export class FpoService {
  constructor(private readonly fpoRepo: FpoRepository) {}

  async createFpo(input: CreateFpoInput) {
    const existing = await this.fpoRepo.findByRegistration(input.registrationNumber);
    if (existing) {
      throw new AppError('FPO with this registration number already exists', HTTP_STATUS.CONFLICT);
    }
    return this.fpoRepo.create(input);
  }

  async getFpoById(id: string) {
    const fpo = await this.fpoRepo.findById(id);
    if (!fpo) {
      throw new AppError('FPO not found', HTTP_STATUS.NOT_FOUND);
    }
    return fpo;
  }

  async updateFpo(id: string, input: UpdateFpoInput) {
    await this.getFpoById(id);
    if (input.registrationNumber) {
      const existing = await this.fpoRepo.findByRegistration(input.registrationNumber);
      if (existing && existing.id !== id) {
        throw new AppError('Another FPO with this registration number already exists', HTTP_STATUS.CONFLICT);
      }
    }
    return this.fpoRepo.update(id, input);
  }

  async deleteFpo(id: string) {
    await this.getFpoById(id);
    return this.fpoRepo.delete(id);
  }

  async getFpos(query: QueryFpoInput) {
    const { data, total } = await this.fpoRepo.findAll(query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    return formatPaginatedResponse(data, total, page, limit);
  }
}
