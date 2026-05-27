'use client';

/**
 * Hook to update an existing service.
 * Uses TanStack Query useMutation + toast + queryClient.invalidateQueries
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { apiLogger } from '@/lib/helpers/api-logger';
import type { ServiceUpdateInput } from '@/features/company-services/validations/service.schema';
import type { ServiceResponse } from '@/features/company-services/types/service.types';

export function useUpdateService(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ServiceResponse, Error, ServiceUpdateInput>({
    mutationFn: async (data: ServiceUpdateInput) => {
      apiLogger.debug('[useUpdateService] Updating service', { id });
      const response = await api.put<ServiceResponse>(`/services/${id}`, data);
      return response.data;
    },
    onSuccess: (service) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      toast.success(`Đã cập nhật dịch vụ "${service.title}"`);
      router.refresh();
    },
    onError: (error) => {
      apiLogger.logError('[useUpdateService] Failed', error);
      toast.error(error.message || 'Không thể cập nhật dịch vụ. Vui lòng thử lại.');
    },
  });
}
