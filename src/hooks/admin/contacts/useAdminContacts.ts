'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { apiLogger } from '@/lib/helpers/api-logger';
import type { ContactListResponse, ContactSubmissionResponse } from '@/features/contact-submissions/types/contact-submission.types';

export interface AdminContactsParams {
  page: number;
  size: number;
  search?: string;
  status?: string;
}

export function useAdminContacts(params: AdminContactsParams) {
  const { page, size, search, status } = params;

  const { data, isLoading, isFetching, refetch, error } = useQuery<ContactListResponse>({
    queryKey: ['admin', 'contacts', { page, size, search, status }],
    queryFn: async () => {
      apiLogger.debug('[useAdminContacts] Fetching contacts', { page, size, search, status });
      const qs = new URLSearchParams({
        page: String(page),
        size: String(size),
        ...(search ? { search } : {}),
        ...(status && status !== 'ALL' ? { status } : {}),
      });
      const res = await api.get<ContactListResponse>(`/contacts?${qs}`);
      return res.data;
    },
    staleTime: 0,
    gcTime: 0,
  });

  const contacts: ContactSubmissionResponse[] = data?.contacts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  return {
    contacts,
    total,
    pagination: { page, size, total, totalPages, hasNext: page < totalPages },
    isLoading,
    isFetching,
    refetch,
    error,
  };
}
