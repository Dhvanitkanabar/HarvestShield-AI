import crypto from 'crypto';

/**
 * Generates a unique batch number in the format HS-YYYY-XXXXXX
 * @returns {string} Batch number
 */
export function generateBatchNumber(): string {
  const year = new Date().getFullYear();
  // Generate a random 6-character hex string (e.g. 1a2b3c) and uppercase it
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `HS-${year}-${randomStr}`;
}

/**
 * Calculates the expected expiry date based on harvest date and shelf life.
 * @param harvestDate The date the crop was harvested
 * @param shelfLifeDays The average shelf life in days
 * @returns {Date} Expiry Date
 */
export function calculateExpiryDate(harvestDate: Date | string, shelfLifeDays: number): Date {
  const date = new Date(harvestDate);
  date.setDate(date.getDate() + shelfLifeDays);
  return date;
}
