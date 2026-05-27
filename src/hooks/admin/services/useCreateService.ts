'use client';

/**
 * Hook to create a new service.
 * Uses TanStack Query useMutation + toast + queryClient.invalidateQueries
 * Pattern: goodseed-app-vercel → hooks/admin/users/useUpdateUser.ts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { apiLogger } from '@/lib/helpers/api-logger';
import type { ServiceCreateInput } from '@/features/company-services/validations/service.schema';
import type { ServiceResponse } from '@/features/company-services/types/service.types';

export function useCreateService() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ServiceResponse, Error, ServiceCreateInput>({
    mutationFn: async (data: ServiceCreateInput) => {
      apiLogger.debug('[useCreateService] Creating service', { slug: data.slug });
      const response = await api.post<ServiceResponse>('/services', data);
      return response.data;
    },
    onSuccess: (service) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      toast.success(`Đã tạo dịch vụ "${service.title}"`);
      router.push('/dashboard/admin/services');
      router.refresh();
    },
    onError: (error) => {
      apiLogger.logError('[useCreateService] Failed', error);
      toast.error(error.message || 'Không thể tạo dịch vụ. Vui lòng thử lại.');
    },
  });
}
