'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { apiLogger } from '@/lib/helpers/api-logger';

export function useDeleteContact() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id: string) => {
      apiLogger.debug('[useDeleteContact] Deleting contact', { id });
      const res = await api.delete<{ success: boolean }>(`/contacts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
      toast.success('Đã xóa yêu cầu liên hệ');
      router.push('/dashboard/admin/contacts');
      router.refresh();
    },
    onError: (error) => {
      apiLogger.logError('[useDeleteContact] Failed', error);
      toast.error(error.message || 'Không thể xóa. Vui lòng thử lại.');
    },
  });
}
