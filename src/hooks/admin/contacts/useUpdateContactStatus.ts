'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { apiLogger } from '@/lib/helpers/api-logger';
import type { ContactSubmissionResponse } from '@/features/contact-submissions/types/contact-submission.types';
import type { ContactUpdateInput } from '@/features/contact-submissions/validations/contact-submission.schema';

export function useUpdateContactStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation<ContactSubmissionResponse, Error, ContactUpdateInput>({
    mutationFn: async (data) => {
      apiLogger.debug('[useUpdateContactStatus] Updating contact', { id, status: data.status });
      const res = await api.patch<ContactSubmissionResponse>(`/contacts/${id}`, data);
      return res.data;
    },
    onSuccess: (contact) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
      queryClient.setQueryData(['admin', 'contact', id], contact);
      toast.success('Đã cập nhật trạng thái yêu cầu');
    },
    onError: (error) => {
      apiLogger.logError('[useUpdateContactStatus] Failed', error);
      toast.error(error.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    },
  });
}
