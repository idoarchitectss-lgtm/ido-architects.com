"use client";

import { useState, useCallback } from "react";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaUploader } from "@/components/custom/media/media-uploader";
import { MediaGrid } from "@/components/custom/media/media-grid";
import { useMedia } from "@/hooks/use-media";
import type { MediaItem } from "@/features/media/types/media.types";
import { toast } from "sonner";

interface MediaSelectorProps {
  /** Callback khi người dùng confirm chọn ảnh */
  onSelect: (item: MediaItem) => void;
  /** URL ảnh đang được chọn (để highlight & preview) */
  selectedUrl?: string;
  /** Label cho nút mở selector */
  label?: string;
  /** Hiển thị preview ảnh đang chọn không */
  showPreview?: boolean;
  /** Xóa chọn */
  onClear?: () => void;
  className?: string;
}

/**
 * MediaSelector — dùng trong form để chọn/thay ảnh từ thư viện Vercel Blob.
 * Có preview + nút mở dialog, tích hợp upload ngay trong dialog.
 */
export function MediaSelector({
  onSelect,
  selectedUrl,
  label = "Chọn từ thư viện",
  showPreview = true,
  onClear,
  className,
}: MediaSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    media,
    pagination,
    isLoading,
    filterParams,
    setFilterParams,
    deleteMedia,
    deletingIds,
    updateMediaMeta,
    refetch,
  } = useMedia({ defaultParams: { page: 1, limit: 24 } });

  const handleOpen = () => {
    setSearch("");
    setPage(1);
    setFilterParams({ page: 1, search: undefined });
    setOpen(true);
  };

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
      setFilterParams({ page: 1, search: value || undefined });
    },
    [setFilterParams]
  );

  const handlePageChange = (p: number) => {
    setPage(p);
    setFilterParams({ page: p });
  };

  const handleSelect = (item: MediaItem) => {
    onSelect(item);
    setOpen(false);
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Xóa ảnh "${item.filename}"?`)) return;
    try {
      await deleteMedia(item.id);
      toast.success("Đã xóa ảnh", { description: item.filename });
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleUpdateAlt = async (item: MediaItem, alt: string) => {
    try {
      await updateMediaMeta({ id: item.id, alt });
      toast.success("Đã cập nhật alt text");
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Preview ảnh đang chọn */}
      {showPreview && selectedUrl && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <Image
            src={selectedUrl}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized
          />
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow"
              title="Xóa ảnh"
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}

      {/* Trigger button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className="gap-2"
      >
        <ImageIcon size={14} />
        {selectedUrl ? "Thay đổi ảnh" : label}
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={(v) => !v && setOpen(false)}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col bg-white text-gray-900 p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle>Thư viện ảnh — Vercel Blob</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4 mt-4">
            {/* Upload zone */}
            <MediaUploader
              onUploadSuccess={(item) => {
                refetch();
                toast.success("Upload thành công!", { description: item.filename });
              }}
              maxFiles={5}
            />

            {/* Search */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Tìm kiếm theo tên file..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-xs"
              />
              {pagination && (
                <span className="text-xs text-gray-400">
                  {pagination.total} ảnh
                </span>
              )}
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-6 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
                ))}
              </div>
            ) : (
              <MediaGrid
                media={media}
                selectedUrl={selectedUrl}
                onSelect={handleSelect}
                onDelete={handleDelete}
                onUpdateAlt={handleUpdateAlt}
                deletingIds={deletingIds}
              />
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => handlePageChange(page - 1)}
                >
                  ← Trước
                </Button>
                <span className="text-sm text-gray-500">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Tiếp →
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
