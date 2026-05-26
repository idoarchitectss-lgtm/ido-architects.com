'use client';

/**
 * Hook to fetch admin posts list with search & pagination.
 * Pattern follows goodseed-app-vercel: useFetchUsers / useFetchSeeds
 * Uses TanStack Query — no cache for admin pages (staleTime: 0, gcTime: 0)
 */

import { useQuery } from '@tanstack/react-query';
import { apiLogger } from '@/lib/helpers/api-logger';
import type { PostType } from '@generated/prisma/client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminPostItem {
  id: string;
  title: string;
  slug: string;
  type: PostType;
  isPublished: boolean;
  publishedAt: string | null;
}

export interface AdminPostsPagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UseAdminPostsParams {
  search?: string;
  type?: PostType | '';
  page?: number;
  size?: number;
}

export interface UseAdminPostsResult {
  posts: AdminPostItem[];
  pagination: AdminPostsPagination | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAdminPosts(params: UseAdminPostsParams = {}): UseAdminPostsResult {
  const { search = '', type = '', page = 1, size = 15 } = params;

  const queryKey = ['admin', 'posts', { search, type, page, size }];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (search) qs.set('search', search);
      if (type) qs.set('type', type);
      qs.set('page', String(page));
      qs.set('size', String(size));
      qs.set('showAll', 'true');

      apiLogger.debug('[useAdminPosts] Fetching', { search, type, page, size });

      const res = await fetch(`/api/posts?${qs.toString()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = typeof body.error === 'string' ? body.error : `HTTP ${res.status}`;
        apiLogger.logError('[useAdminPosts] fetch failed', new Error(msg));
        throw new Error(msg);
      }

      const data = await res.json();

      apiLogger.logResponse('[useAdminPosts]', { search, type, page }, {
        total: data.total ?? data.pagination?.total,
        count: data.posts?.length ?? data.data?.length,
      });

      return data;
    },
    // No cache for admin — always fresh data
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  // Normalise API response — support { posts, total }, { data, pagination }, { posts, pageInfo }
  const raw = query.data;
  const posts: AdminPostItem[] = raw?.posts ?? raw?.data ?? [];
  const total: number = raw?.total ?? raw?.pagination?.total ?? raw?.pageInfo?.total ?? 0;
  const totalPages = Math.ceil(total / size);

  const pagination: AdminPostsPagination | null = total
    ? {
        page,
        size,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    : null;

  return {
    posts,
    pagination,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
