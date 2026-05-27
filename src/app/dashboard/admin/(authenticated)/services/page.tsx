'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon, PencilIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminServices } from '@/hooks/admin/services/useAdminServices';
import PaginationComponent from '@/components/custom/pagination/PaginationComponent';

const PAGE_SIZE = 20;

function ServicesPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get('search') ?? '';
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));

  const { services, pagination, isLoading, isFetching, refetch } = useAdminServices({
    search,
    page,
    size: PAGE_SIZE,
  });

  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set('search', val); else params.delete('search');
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dịch vụ</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isFetching && !isLoading
              ? 'Đang cập nhật...'
              : search
              ? `${total} kết quả cho "${search}"`
              : `${total} dịch vụ`}
          </p>
        </div>
        <Link href="/dashboard/admin/services/new">
          <Button size="sm" className="gap-1.5">
            <PlusIcon size={14} />
            Tạo dịch vụ
          </Button>
        </Link>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-sm">
          <Input
            name="search"
            defaultValue={search}
            placeholder="Tìm kiếm dịch vụ..."
            className="h-8 text-sm"
          />
          <Button type="submit" size="sm" variant="secondary" className="h-8 px-3">
            Tìm
          </Button>
        </form>
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
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="h-4 bg-gray-200 rounded animate-pulse flex-1 max-w-xs" />
                <div className="h-5 w-14 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Tiêu đề</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-20">Thứ tự</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-28">Trạng thái</th>
                <th className="w-16 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((svc) => (
                <tr key={svc.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900 truncate max-w-xs">{svc.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 font-mono">{svc.slug}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs">{svc.sortOrder}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${
                      svc.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${svc.isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {svc.isPublished ? 'Công khai' : 'Nháp'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/dashboard/admin/services/${svc.id}`}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                    >
                      <PencilIcon size={12} />
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-14 text-center">
                    {search ? (
                      <>
                        <p className="text-gray-400 text-sm">Không tìm thấy dịch vụ nào cho &ldquo;{search}&rdquo;</p>
                        <Link href="/dashboard/admin/services" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Xóa bộ lọc →</Link>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-400 text-sm">Chưa có dịch vụ nào</p>
                        <Link href="/dashboard/admin/services/new" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Tạo dịch vụ đầu tiên →</Link>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-gray-400">Trang {page} / {totalPages} — {total} dịch vụ</p>
          <PaginationComponent pageCount={totalPages} />
        </div>
      )}
    </div>
  );
}

export default function AdminServicesPage() {
  return (
    <Suspense>
      <ServicesPageInner />
    </Suspense>
  );
}
