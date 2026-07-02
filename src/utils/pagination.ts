// ==================================================
// Pagination Helper
// ==================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Extracts and formats skip and take values for Prisma.
 */
export function getPaginationArgs(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 10)); // Max 100 items per page
  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
}

/**
 * Formats data and total count into a paginated response structure.
 */
export function formatPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}
