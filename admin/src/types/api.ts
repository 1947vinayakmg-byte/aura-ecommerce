/**
 * Standard API Response Structure
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Paginated API Response Structure
 */
export interface PaginatedResponse<T> {
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

/**
 * Common API Error Structure
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
  status: number;
}

/**
 * Request Search/Filter/Pagination Params
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}

/**
 * Auth Specific Response
 */
export interface AuthResponse {
  user: import('./user').User;
  token: string;
}

/**
 * Stat Metrics Response
 */
export interface StatMetric {
  label: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down';
}
