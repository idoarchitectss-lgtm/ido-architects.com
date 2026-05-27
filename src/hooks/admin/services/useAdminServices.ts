'use client';

/**
 * Hook to fetch admin services list with search & pagination.
 * Uses TanStack Query — no cache for admin pages (staleTime: 0, gcTime: 0)
 * Pattern: goodseed-app-vercel → hooks/admin/users/useFetchUsers.ts
 */

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { apiLogger } from '@/lib/helpers/api-logger';
import type { ServiceListResponse } from '@/features/company-services/types/service.types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminServiceItem {
  id: string;
  title: string;
  slug: string;
  icon: string | null;
  isPublished: boolean;
  sortOrder: number;
}

export interface AdminServicesPagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UseAdminServicesParams {
  search?: string;
  page?: number;
  size?: number;
}

export interface UseAdminServicesResult {
  services: AdminServiceItem[];
  pagination: AdminServicesPagination | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAdminServices(params: UseAdminServicesParams = {}): UseAdminServicesResult {
  const { search = '', page = 1, size = 20 } = params;

  const query = useQuery<ServiceListResponse>({
    queryKey: ['admin', 'services', { search, page, size }],
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (search) qs.set('search', search);
      qs.set('page', String(page));
      qs.set('size', String(size));
      qs.set('showAll', 'true');

      apiLogger.debug('[useAdminServices] Fetching', { search, page, size });

      const response = await api.get<ServiceListResponse>(`/services?${qs.toString()}`);

      apiLogger.logResponse('[useAdminServices]', { search, page }, {
        total: response.data.total,
        count: response.data.services.length,
      });

      return response.data;
    },
    // No cache for admin — always fresh data
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const raw = query.data;
  const services: AdminServiceItem[] = raw?.services ?? [];
  const total: number = raw?.total ?? 0;
  const totalPages = Math.ceil(total / size);

  const pagination: AdminServicesPagination | null = total
    ? { page, size, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 }
    : null;

  return {
    services,
    pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}