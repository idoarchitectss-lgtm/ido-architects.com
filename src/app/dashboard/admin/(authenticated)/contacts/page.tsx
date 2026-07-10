'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { RefreshCwIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminContacts } from '@/hooks/admin/contacts/useAdminContacts';
import PaginationComponent from '@/components/custom/pagination/PaginationComponent';
import type { ContactStatus } from '@/features/contact-submissions/types/contact-submission.types';

const PAGE_SIZE = 20;

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'NEW', label: 'Mới' },
  { value: 'READ', label: 'Đã đọc' },
  { value: 'RESOLVED', label: 'Đã xử lý' },
  { value: 'SPAM', label: 'Spam' },
];

const STATUS_STYLES: Record<ContactStatus, string> = {
  NEW: 'bg-blue-50 text-blue-700 border-blue-200',
  READ: 'bg-gray-50 text-gray-600 border-gray-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  SPAM: 'bg-red-50 text-red-600 border-red-200',
};

const STATUS_LABELS: Record<ContactStatus, string> = {
  NEW: 'Mới',
  READ: 'Đã đọc',
  RESOLVED: 'Đã xử lý',
  SPAM: 'Spam',
};

function ContactsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? 'ALL';
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));

  const { contacts, pagination, isLoading, isFetching, refetch } = useAdminContacts({
    search,
    page,
    size: PAGE_SIZE,
    status,
  });

  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
    setParam('search', val);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Yêu cầu liên hệ</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isFetching && !isLoading
              ? 'Đang cập nhật...'
              : search
              ? `${total} kết quả cho "${search}"`
              : `${total} yêu cầu`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-sm">
          <Input
            name="search"
            defaultValue={search}
            placeholder="Tìm tên, email, SĐT..."
            className="h-8 text-sm"
          />
          <Button type="submit" size="sm" variant="secondary" className="h-8 px-3">Tìm</Button>
        </form>

        {/* Status filter */}
        <div className="flex items-center gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setParam('status', opt.value === 'ALL' ? '' : opt.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                (opt.value === 'ALL' && (!status || status === 'ALL')) ||
                status === opt.value
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-gray-500"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCwIcon size={13} className={isFetching ? 'animate-spin' : ''} />
          Làm mới
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="h-4 bg-gray-200 rounded animate-pulse flex-1 max-w-[180px]" />
                <div className="h-4 bg-gray-200 rounded animate-pulse flex-1 max-w-[220px]" />
                <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Khách hàng</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Liên hệ</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-28">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-36">Ngày gửi</th>
                <th className="w-16 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{c.name}</p>
                    {c.service && (
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[11px] font-medium">
                        {c.service.title}
                      </span>
                    )}
                    {c.message && (
                      <p className="text-gray-400 text-xs mt-0.5 truncate max-w-[240px]">{c.message}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 space-y-0.5">
                    <p className="flex items-center gap-1 text-xs text-gray-600">
                      <MailIcon size={11} className="text-gray-400" />
                      {c.email}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-gray-600">
                      <PhoneIcon size={11} className="text-gray-400" />
                      {c.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_STYLES[c.status]}`}>
                      {c.status === 'NEW' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                      {STATUS_LABELS[c.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400 text-xs">
                    {new Date(c.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/dashboard/admin/contacts/${c.id}`}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                    >
                      Xem
                    </Link>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <p className="text-gray-400 text-sm">
                      {search ? `Không tìm thấy kết quả cho "${search}"` : 'Chưa có yêu cầu nào'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-gray-400">Trang {page} / {totalPages} — {total} yêu cầu</p>
          <PaginationComponent pageCount={totalPages} />
        </div>
      )}
    </div>
  );
}

export default function AdminContactsPage() {
  return (
    <Suspense>
      <ContactsPageInner />
    </Suspense>
  );
}
