import { AppError } from './appError.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Validates if the warehouse has enough capacity to store the batch.
 * @param availableCapacity Current available capacity of the warehouse
 * @param requiredQuantity The quantity trying to be stored
 */
export function validateInventoryCapacity(availableCapacity: number, requiredQuantity: number): void {
  if (availableCapacity < requiredQuantity) {
    throw new AppError(
      `Insufficient warehouse capacity. Required: ${requiredQuantity}, Available: ${availableCapacity}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }
}

/**
 * Calculates the new remaining quantity and prevents negative inventory.
 * @param currentRemaining Current remaining quantity
 * @param deduction Amount to deduct (sold, spoiled, etc.)
 * @returns {number} The new remaining quantity
 */
export function calculateRemainingQuantity(currentRemaining: number, deduction: number): number {
  if (deduction < 0) {
      throw new AppError('Deduction amount cannot be negative', HTTP_STATUS.BAD_REQUEST);
  }
  
  const newRemaining = currentRemaining - deduction;
  if (newRemaining < 0) {
    throw new AppError(
      `Cannot deduct ${deduction}. Only ${currentRemaining} remaining.`,
      HTTP_STATUS.BAD_REQUEST
    );
  }
  return newRemaining;
}
