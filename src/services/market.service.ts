import { MarketRepository } from '../repositories/market.repository.js';
import { AppError, formatPaginatedResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import type { CreateMarketInput, UpdateMarketInput, QueryMarketInput } from '../validators/market.validator.js';

export class MarketService {
  constructor(private readonly marketRepo: MarketRepository) {}

  async createMarket(input: CreateMarketInput) {
    return this.marketRepo.create(input);
  }

  async getMarketById(id: string) {
    const market = await this.marketRepo.findById(id);
    if (!market) {
      throw new AppError('Market not found', HTTP_STATUS.NOT_FOUND);
    }
    return market;
  }

  async updateMarket(id: string, input: UpdateMarketInput) {
    await this.getMarketById(id);
    return this.marketRepo.update(id, input);
  }

  async deleteMarket(id: string) {
    await this.getMarketById(id);
    return this.marketRepo.delete(id);
  }

  async getMarkets(query: QueryMarketInput) {
    const { data, total } = await this.marketRepo.findAll(query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    return formatPaginatedResponse(data, total, page, limit);
  }
}
