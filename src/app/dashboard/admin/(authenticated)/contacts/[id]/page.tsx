'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useUpdateContactStatus } from '@/hooks/admin/contacts/useUpdateContactStatus';
import { useDeleteContact } from '@/hooks/admin/contacts/useDeleteContact';
import type { ContactSubmissionResponse, ContactStatus } from '@/features/contact-submissions/types/contact-submission.types';

const STATUS_OPTIONS: { value: ContactStatus; label: string; style: string }[] = [
  { value: 'NEW', label: 'Mới', style: 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100' },
  { value: 'READ', label: 'Đã đọc', style: 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100' },
  { value: 'RESOLVED', label: 'Đã xử lý', style: 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' },
  { value: 'SPAM', label: 'Spam', style: 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100' },
];

export default function ContactDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [note, setNote] = useState('');

  const { data: contact, isLoading } = useQuery({
    queryKey: ['admin', 'contact', params.id],
    queryFn: async (): Promise<ContactSubmissionResponse> => {
      const res = await api.get<ContactSubmissionResponse>(`/contacts/${params.id}`);
      return res.data;
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (contact) setNote(contact.note ?? '');
  }, [contact]);

  const updateMutation = useUpdateContactStatus(params.id);
  const deleteMutation = useDeleteContact();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full max-w-md" />
          ))}
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Không tìm thấy yêu cầu này.</p>
        <Link href="/dashboard/admin/contacts" className="text-sm text-blue-600 hover:underline mt-2 inline-block">← Quay lại danh sách</Link>
      </div>
    );
  }

  const handleSaveNote = () => {
    updateMutation.mutate({ status: contact.status, note });
  };

  const handleDelete = () => {
    if (confirm('Xóa yêu cầu liên hệ này? Hành động không thể hoàn tác.')) {
      deleteMutation.mutate(params.id);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/admin/contacts"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeftIcon size={14} />
          Danh sách yêu cầu
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-1.5"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <TrashIcon size={14} />
          Xóa
        </Button>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{contact.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date(contact.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Số điện thoại</p>
            <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">{contact.phone}</a>
          </div>
        </div>

        {contact.message && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Nội dung</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100">
              {contact.message}
            </p>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Trạng thái</h2>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              disabled={updateMutation.isPending}
              onClick={() => updateMutation.mutate({ status: opt.value, note })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${opt.style} ${
                contact.status === opt.value ? 'ring-2 ring-offset-1 ring-gray-400' : ''
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Internal note */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Ghi chú nội bộ</p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thêm ghi chú cho yêu cầu này..."
            rows={3}
            className="text-sm resize-none"
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={handleSaveNote}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu ghi chú'}
          </Button>
        </div>
      </div>
    </div>
  );
}
