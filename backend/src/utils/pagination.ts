export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function parsePaginationQuery(query: any): Required<PaginationQuery> {
  const parsedPage = parseInt(query.page as string, 10);
  const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
  const parsedLimit = parseInt(query.limit as string, 10);
  const limit = isNaN(parsedLimit) ? 20 : Math.min(100, Math.max(1, parsedLimit));
  const sortBy = (query.sortBy as string) || 'createdAt';
  const sortOrder = (query.sortOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';

  return { page, limit, sortBy, sortOrder };
}

export function formatPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }
  };
}

export function getPrismaPagination(page: number, limit: number) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
