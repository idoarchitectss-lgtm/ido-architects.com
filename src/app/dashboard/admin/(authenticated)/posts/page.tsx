'use client';

/**
 * Admin Posts Page — Client Component
 * Pattern follows goodseed-app-vercel SeedsPageClient:
 *   - useSearchParams to read URL state
 *   - useAdminPosts (TanStack Query, staleTime:0) to fetch data
 *   - PostsFilterBar updates URL -> hook re-fetches automatically
 */

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon, PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostsFilterBar } from '@/app/dashboard/admin/_components/PostsFilterBar';
import { useAdminPosts } from '@/hooks/admin/posts/useAdminPosts';
import PaginationComponent from '@/components/custom/pagination/PaginationComponent';
import type { PostType } from '@generated/prisma/client';

const TYPE_LABEL: Record<PostType, string> = {
  BLOG_POST: 'Blog',
  PROJECT_POST: 'Dự án',
};

const TYPE_COLOR: Record<PostType, string> = {
  BLOG_POST: 'bg-blue-50 text-blue-700 border-blue-200',
  PROJECT_POST: 'bg-violet-50 text-violet-700 border-violet-200',
};

const PAGE_SIZE = 10;

// Inner component needs useSearchParams — must be inside Suspense
function PostsPageInner() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const type = (searchParams.get('type') as PostType) || undefined;
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));

  const { posts, pagination, isLoading, isFetching, refetch } = useAdminPosts({
    search,
    type,
    page,
    size: PAGE_SIZE,
  });

  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Bài viết</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isFetching && !isLoading
              ? 'Đang cập nhật...'
              : search
              ? `${total} kết quả cho “${search}”`
              : `${total} bài viết`}
          </p>
        </div>
        <Link href="/dashboard/admin/posts/new">
          <Button size="sm" className="gap-1.5">
            <PlusIcon size={14} />
            Tạo bài viết
          </Button>
        </Link>
      </div>

      {/* Filter bar */}
      <PostsFilterBar isFetching={isFetching} onRefresh={refetch} />

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="h-4 bg-gray-200 rounded animate-pulse flex-1 max-w-xs" />
                <div className="h-5 w-14 bg-gray-200 rounded-md animate-pulse" />
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
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Tiêu đề</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-28">Loại</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-28">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-36">Ngày đăng</th>
                <th className="w-16 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900 truncate max-w-xs">{post.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 font-mono">{post.slug}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${TYPE_COLOR[post.type]}`}>
                      {TYPE_LABEL[post.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`whitespace-nowrap inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${ post.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${post.isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {post.isPublished ? 'Đã đăng' : 'Nháp'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('vi-VN')
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/dashboard/admin/posts/${post.id}`}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                    >
                      <PencilIcon size={12} />
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    {search ? (
                      <>
                        <p className="text-gray-400 text-sm">Không tìm thấy bài viết nào cho “{search}”</p>
                        <Link href="/dashboard/admin/posts" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Xóa bộ lọc →</Link>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-400 text-sm">Chưa có bài viết nào</p>
                        <Link href="/dashboard/admin/posts/new" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Tạo bài viết đầu tiên →</Link>
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
          <p className="text-xs text-gray-400">Trang {page} / {totalPages} — {total} bài viết</p>
          <PaginationComponent pageCount={totalPages} />
        </div>
      )}
    </div>
  );
}

// Wrap in Suspense — required for useSearchParams in Next.js
export default function AdminPostsPage() {
  return (
    <Suspense>
      <PostsPageInner />
    </Suspense>
  );
}