import { HarvestRepository } from '../repositories/harvest.repository.js';
import { cropRepository } from '../repositories/crop.repository.js';
import { farmerRepository } from '../repositories/farmer.repository.js';
import { AppError, formatPaginatedResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import { generateBatchNumber } from '../utils/batch.js';
import type { CreateHarvestInput, UpdateHarvestInput, QueryHarvestInput } from '../validators/harvest.validator.js';
import { prisma } from '../prisma/client.js';

export class HarvestService {
  constructor(private readonly harvestRepo: HarvestRepository) {}

  async createHarvest(userId: string, input: CreateHarvestInput) {
    const farmer = await farmerRepository.findByUserId(userId);
    if (!farmer) throw new AppError('Farmer profile not found', HTTP_STATUS.NOT_FOUND);

    const crop = await cropRepository.findById(input.cropId);
    if (!crop) throw new AppError('Crop not found', HTTP_STATUS.NOT_FOUND);

    const batchNumber = generateBatchNumber();
    const expectedShelfLifeDays = crop.averageShelfLife || 0;

    // Use a transaction to create harvest batch and initial movement record
    const result = await prisma.$transaction(async (tx) => {
        const batch = await tx.harvestBatch.create({
            data: {
                batchNumber,
                farmerId: farmer.id,
                cropId: input.cropId,
                fpoId: input.fpoId || farmer.fpoId,
                quantity: input.quantity,
                unit: input.unit || 'KG',
                qualityGrade: input.qualityGrade,
                harvestDate: new Date(input.harvestDate),
                expectedShelfLifeDays,
                currentStatus: 'FRESH',
                currentLocation: farmer.farmName || farmer.village,
                remarks: input.remarks,
            }
        });

        await tx.movement.create({
            data: {
                batchId: batch.id,
                movementType: 'HARVEST',
                fromLocation: 'FIELD',
                toLocation: batch.currentLocation,
                remarks: 'Initial Harvest',
            }
        });

        return batch;
    });

    return result;
  }

  async getHarvestById(id: string) {
    const harvest = await this.harvestRepo.findById(id);
    if (!harvest) throw new AppError('Harvest batch not found', HTTP_STATUS.NOT_FOUND);
    return harvest;
  }

  async updateHarvest(id: string, input: UpdateHarvestInput) {
    await this.getHarvestById(id);
    return this.harvestRepo.update(id, input);
  }

  async deleteHarvest(id: string) {
    await this.getHarvestById(id);
    return this.harvestRepo.delete(id);
  }

  async getHarvests(query: QueryHarvestInput) {
    const { data, total } = await this.harvestRepo.findAll(query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    return formatPaginatedResponse(data, total, page, limit);
  }
}
