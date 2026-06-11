'use client';

/**
 * Filter bar for admin posts page.
 * Pattern follows goodseed-app-vercel SeedsPageClient:
 *   - reads URL via useSearchParams
 *   - updates URL via useRouter.push (preserves other params)
 *   - debounce on search input (500ms)
 */

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useRef, useTransition } from 'react';
import { Search, X, Loader2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';

const TYPE_OPTIONS = [
  { label: 'Tất cả', value: '' },
  { label: 'Blog', value: 'BLOG_POST' },
  { label: 'Dự án', value: 'PROJECT_POST' },
] as const;

interface PostsFilterBarProps {
  isFetching?: boolean;
  onRefresh?: () => void;
}

export function PostsFilterBar({ isFetching, onRefresh }: PostsFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSearch = searchParams.get('search') ?? '';
  const currentType = searchParams.get('type') ?? '';

  /** Merge updates vào URL hiện tại, luôn reset page về 1 */
  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      params.delete('page'); // reset page khi filter thay đổi
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const handleSearchChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams({ search: value });
    }, 500);
  };

  const handleClearSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    pushParams({ search: '' });
  };

  const handleTypeChange = (value: string) => {
    pushParams({ type: value });
  };

  const isLoading = isPending || isFetching;

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search input */}
      <div className="relative flex-1 max-w-sm">
        {isLoading ? (
          <Loader2
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin pointer-events-none"
          />
        ) : (
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        )}
        <Input
          key={currentSearch}
          defaultValue={currentSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Tìm kiếm tiêu đề, slug..."
          className="pl-9 pr-8 h-9 bg-white text-sm"
        />
        {currentSearch && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            title="Xoá tìm kiếm"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Type filter — pill-style theo pattern goodseed */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleTypeChange(opt.value)}
            className={[
              'px-3 py-1 rounded-md text-xs font-medium transition-all',
              currentType === opt.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Refresh button */}
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50"
          title="Làm mới"
        >
          <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
          Làm mới
        </button>
      )}
    </div>
  );
}
