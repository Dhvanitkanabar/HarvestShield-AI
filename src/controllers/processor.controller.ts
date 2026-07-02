import { Request, Response } from 'express';
import { ProcessorService } from '../services/processor.service.js';
import { processorRepository } from '../repositories/processor.repository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';

const processorService = new ProcessorService(processorRepository);

export async function createProcessor(req: Request, res: Response) {
  const result = await processorService.createProcessor(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Processor created successfully', result);
}

export async function getProcessorById(req: Request, res: Response) {
  const result = await processorService.getProcessorById((req.params.id as string));
  sendSuccess(res, HTTP_STATUS.OK, 'Processor retrieved successfully', result);
}

export async function updateProcessor(req: Request, res: Response) {
  const result = await processorService.updateProcessor((req.params.id as string), req.body);
  sendSuccess(res, HTTP_STATUS.OK, 'Processor updated successfully', result);
}

export async function deleteProcessor(req: Request, res: Response) {
  await processorService.deleteProcessor((req.params.id as string));
  sendSuccess(res, HTTP_STATUS.OK, 'Processor deleted successfully', null);
}

export async function getProcessors(req: Request, res: Response) {
  const result = await processorService.getProcessors(req.query);
  sendSuccess(res, HTTP_STATUS.OK, 'Processors retrieved successfully', result);
}
