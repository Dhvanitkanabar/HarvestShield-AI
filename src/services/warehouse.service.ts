import { WarehouseRepository } from '../repositories/warehouse.repository.js';
import { AppError, formatPaginatedResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import type { CreateWarehouseInput, UpdateWarehouseInput, QueryWarehouseInput } from '../validators/warehouse.validator.js';

export class WarehouseService {
  constructor(private readonly warehouseRepo: WarehouseRepository) {}

  async createWarehouse(input: CreateWarehouseInput) {
    return this.warehouseRepo.create(input);
  }

  async getWarehouseById(id: string) {
    const warehouse = await this.warehouseRepo.findById(id);
    if (!warehouse) {
      throw new AppError('Warehouse not found', HTTP_STATUS.NOT_FOUND);
    }
    return warehouse;
  }

  async updateWarehouse(id: string, input: UpdateWarehouseInput) {
    await this.getWarehouseById(id);
    return this.warehouseRepo.update(id, input);
  }

  async deleteWarehouse(id: string) {
    await this.getWarehouseById(id);
    return this.warehouseRepo.delete(id);
  }

  async getWarehouses(query: QueryWarehouseInput) {
    const { data, total } = await this.warehouseRepo.findAll(query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    return formatPaginatedResponse(data, total, page, limit);
  }
}
