import { ProcessorRepository } from '../repositories/processor.repository.js';
import { AppError, formatPaginatedResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import type { CreateProcessorInput, UpdateProcessorInput, QueryProcessorInput } from '../validators/processor.validator.js';

export class ProcessorService {
  constructor(private readonly processorRepo: ProcessorRepository) {}

  async createProcessor(input: CreateProcessorInput) {
    return this.processorRepo.create(input);
  }

  async getProcessorById(id: string) {
    const processor = await this.processorRepo.findById(id);
    if (!processor) {
      throw new AppError('Processor not found', HTTP_STATUS.NOT_FOUND);
    }
    return processor;
  }

  async updateProcessor(id: string, input: UpdateProcessorInput) {
    await this.getProcessorById(id);
    return this.processorRepo.update(id, input);
  }

  async deleteProcessor(id: string) {
    await this.getProcessorById(id);
    return this.processorRepo.delete(id);
  }

  async getProcessors(query: QueryProcessorInput) {
    const { data, total } = await this.processorRepo.findAll(query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    return formatPaginatedResponse(data, total, page, limit);
  }
}
