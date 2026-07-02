import { Request, Response } from 'express';
import { WarehouseService } from '../services/warehouse.service.js';
import { warehouseRepository } from '../repositories/warehouse.repository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';

const warehouseService = new WarehouseService(warehouseRepository);

export async function createWarehouse(req: Request, res: Response) {
  const result = await warehouseService.createWarehouse(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Warehouse created successfully', result);
}

export async function getWarehouseById(req: Request, res: Response) {
  const result = await warehouseService.getWarehouseById((req.params.id as string));
  sendSuccess(res, HTTP_STATUS.OK, 'Warehouse retrieved successfully', result);
}

export async function updateWarehouse(req: Request, res: Response) {
  const result = await warehouseService.updateWarehouse((req.params.id as string), req.body);
  sendSuccess(res, HTTP_STATUS.OK, 'Warehouse updated successfully', result);
}

export async function deleteWarehouse(req: Request, res: Response) {
  await warehouseService.deleteWarehouse((req.params.id as string));
  sendSuccess(res, HTTP_STATUS.OK, 'Warehouse deleted successfully', null);
}

export async function getWarehouses(req: Request, res: Response) {
  const result = await warehouseService.getWarehouses(req.query);
  sendSuccess(res, HTTP_STATUS.OK, 'Warehouses retrieved successfully', result);
}
