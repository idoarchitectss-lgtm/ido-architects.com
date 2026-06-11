'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import api from '@/lib/api';
import { apiLogger } from '@/lib/helpers/api-logger';

export interface CurrentUserProfile {
  id: string;
  email: string;
  name: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: string;
}

/**
 * Fetch current authenticated user profile from /api/me.
 * - Caches 5 minutes for public pages
 * - NO CACHE for dashboard/admin pages (per coding instructions)
 */
export function useFetchCurrentUser() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  return useQuery<CurrentUserProfile, Error>({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await api.get<CurrentUserProfile>('/me');
      apiLogger.debug('[useFetchCurrentUser] loaded', { id: response.data.id });
      return response.data;
    },
    staleTime: isAdminPage ? 0 : 1000 * 60 * 5, // 0 for admin, 5 min otherwise
    retry: 1,
    refetchOnWindowFocus: !isAdminPage,
  });
}
