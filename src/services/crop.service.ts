import { CropRepository } from '../repositories/crop.repository.js';
import { AppError, formatPaginatedResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import type { CreateCropInput, UpdateCropInput, QueryCropInput } from '../validators/crop.validator.js';

export class CropService {
  constructor(private readonly cropRepo: CropRepository) {}

  async createCrop(input: CreateCropInput) {
    return this.cropRepo.create(input);
  }

  async getCropById(id: string) {
    const crop = await this.cropRepo.findById(id);
    if (!crop) {
      throw new AppError('Crop not found', HTTP_STATUS.NOT_FOUND);
    }
    return crop;
  }

  async updateCrop(id: string, input: UpdateCropInput) {
    await this.getCropById(id); // Ensure exists
    return this.cropRepo.update(id, input);
  }

  async deleteCrop(id: string) {
    await this.getCropById(id); // Ensure exists
    return this.cropRepo.delete(id);
  }

  async getCrops(query: QueryCropInput) {
    const { data, total } = await this.cropRepo.findAll(query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    
    return formatPaginatedResponse(data, total, page, limit);
  }
}
