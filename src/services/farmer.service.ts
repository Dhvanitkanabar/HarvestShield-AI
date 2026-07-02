import { FarmerRepository } from '../repositories/farmer.repository.js';
import { AppError, formatPaginatedResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import type { CreateFarmerInput, UpdateFarmerInput, QueryFarmerInput } from '../validators/farmer.validator.js';

export class FarmerService {
  constructor(private readonly farmerRepo: FarmerRepository) {}

  async createFarmer(input: CreateFarmerInput) {
    const existing = await this.farmerRepo.findByUserId(input.userId);
    if (existing) {
      throw new AppError('Farmer profile already exists for this user', HTTP_STATUS.CONFLICT);
    }
    return this.farmerRepo.create(input);
  }

  async getFarmerById(id: string) {
    const farmer = await this.farmerRepo.findById(id);
    if (!farmer) {
      throw new AppError('Farmer not found', HTTP_STATUS.NOT_FOUND);
    }
    return farmer;
  }
  
  async getFarmerByUserId(userId: string) {
    const farmer = await this.farmerRepo.findByUserId(userId);
    if (!farmer) {
      throw new AppError('Farmer profile not found', HTTP_STATUS.NOT_FOUND);
    }
    return farmer;
  }

  async updateFarmer(id: string, input: UpdateFarmerInput) {
    await this.getFarmerById(id);
    return this.farmerRepo.update(id, input);
  }

  async deleteFarmer(id: string) {
    await this.getFarmerById(id);
    return this.farmerRepo.delete(id);
  }

  async getFarmers(query: QueryFarmerInput) {
    const { data, total } = await this.farmerRepo.findAll(query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    return formatPaginatedResponse(data, total, page, limit);
  }
}
