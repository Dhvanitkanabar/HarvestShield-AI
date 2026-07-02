import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service.js';
import { inventoryRepository } from '../repositories/inventory.repository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';

const inventoryService = new InventoryService(inventoryRepository);

export async function createInventory(req: Request, res: Response) {
  const result = await inventoryService.createInventory(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Inventory created successfully', result);
}

export async function getInventoryById(req: Request, res: Response) {
  const result = await inventoryService.getInventoryById(req.params.id as string);
  sendSuccess(res, HTTP_STATUS.OK, 'Inventory retrieved successfully', result);
}

export async function updateInventory(req: Request, res: Response) {
  const result = await inventoryService.updateInventory(req.params.id as string, req.body);
  sendSuccess(res, HTTP_STATUS.OK, 'Inventory updated successfully', result);
}

export async function getInventories(req: Request, res: Response) {
  const result = await inventoryService.getInventories(req.query);
  sendSuccess(res, HTTP_STATUS.OK, 'Inventories retrieved successfully', result);
}

// Dashboard APIs
export async function getDashboardStats(_req: Request, res: Response) {
    const stats = await inventoryRepository.getActiveInventoryStats();
    sendSuccess(res, HTTP_STATUS.OK, 'Inventory stats retrieved', stats);
}
