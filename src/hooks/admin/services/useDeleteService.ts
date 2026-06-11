'use client';

/**
 * Hook to delete a service.
 * Uses TanStack Query useMutation + toast + queryClient.invalidateQueries
 * Pattern: goodseed-app-vercel → hooks/admin/users/useDeleteUser.ts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { apiLogger } from '@/lib/helpers/api-logger';

export function useDeleteService() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id: string) => {
      apiLogger.debug('[useDeleteService] Deleting service', { id });
      const response = await api.delete<{ success: boolean }>(`/services/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      toast.success('Đã xóa dịch vụ');
      router.push('/dashboard/admin/services');
      router.refresh();
    },
    onError: (error) => {
      apiLogger.logError('[useDeleteService] Failed', error);
      toast.error(error.message || 'Không thể xóa dịch vụ. Vui lòng thử lại.');
    },
  });
}
