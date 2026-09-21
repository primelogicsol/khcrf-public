import { parsePaginationQuery, formatPaginatedResponse, getPrismaPagination } from '../src/utils/pagination';

describe('Pagination Utilities', () => {
  describe('parsePaginationQuery', () => {
    it('should return defaults for empty query', () => {
      const result = parsePaginationQuery({});
      expect(result).toEqual({ page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' });
    });

    it('should parse valid values correctly', () => {
      const result = parsePaginationQuery({ page: '2', limit: '50', sortBy: 'title', sortOrder: 'asc' });
      expect(result).toEqual({ page: 2, limit: 50, sortBy: 'title', sortOrder: 'asc' });
    });

    it('should bound limit strictly between 1 and 100', () => {
      const resultUnder = parsePaginationQuery({ limit: '0' });
      expect(resultUnder.limit).toBe(1);

      const resultOver = parsePaginationQuery({ limit: '200' });
      expect(resultOver.limit).toBe(100);
    });
  });

  describe('formatPaginatedResponse', () => {
    it('should correctly format meta response', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = formatPaginatedResponse(data, 10, 1, 2);

      expect(result).toEqual({
        data,
        meta: {
          total: 10,
          page: 1,
          limit: 2,
          totalPages: 5,
          hasNextPage: true,
          hasPrevPage: false,
        }
      });
    });
  });

  describe('getPrismaPagination', () => {
    it('should calculate skip and take', () => {
      const result = getPrismaPagination(2, 20);
      expect(result).toEqual({ skip: 20, take: 20 });
    });
  });
});
