"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import {
  Images, Search, RefreshCw, Grid, List,
  Trash2, CheckSquare, Square, Filter, Pencil, Check, X, Loader2, FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MediaUploader } from "@/components/custom/media/media-uploader";
import { MediaGrid } from "@/components/custom/media/media-grid";
import { useMedia } from "@/hooks/use-media";
import { toast } from "sonner";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import PaginationComponent from "@/components/custom/pagination/PaginationComponent";
import type { MediaItem } from "@/features/media/types/media.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function mimeLabel(mime: string) {
  const map: Record<string, string> = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WebP",
    "image/gif": "GIF",
    "image/svg+xml": "SVG",
  };
  return map[mime] ?? mime;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

const CONTENT_TYPE_OPTIONS = [
  { label: "Tất cả định dạng", value: "all" },
  { label: "JPEG", value: "image/jpeg" },
  { label: "PNG", value: "image/png" },
  { label: "WebP", value: "image/webp" },
  { label: "GIF", value: "image/gif" },
  { label: "SVG", value: "image/svg+xml" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
function AdminMediaPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  const navigatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [contentType, setContentType] = useState("all");
  const [folder, setFolder] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Inline edit state cho list view
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editFilename, setEditFilename] = useState("");
  const [editAlt, setEditAlt] = useState("");

  const openListEdit = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setEditFilename(item.filename);
    setEditAlt(item.alt ?? "");
  };

  const saveListEdit = async () => {
    if (!editingItem) return;
    try {
      await updateMediaMeta({ id: editingItem.id, filename: editFilename || undefined, alt: editAlt || null });
      toast.success("Đã cập nhật", { description: editFilename });
      setEditingItem(null);
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const {
    media, pagination, stats, folders, isLoading,
    setFilterParams, deleteMedia, updateMediaMeta,
    bulkDeleteMedia, deletingIds, isBulkDeleting, refetch,
  } = useMedia({ defaultParams: { page: 1, limit: 24 } });

  useEffect(() => {
    setFilterParams({
      page,
      search: debouncedSearch || undefined,
      contentType: contentType !== "all" ? contentType : undefined,
      folder: folder !== "all" ? folder : undefined,
    });
  }, [page, debouncedSearch, contentType, folder, setFilterParams]);

  const handleSearch = (v: string) => {
    setSearch(v);
    // Debounce 3s: huỷ timer cũ, đặt timer mới
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(v);
      navigatePage(1);
    }, 3000);
  };
  const handleTypeChange = (v: string) => { setContentType(v); navigatePage(1); };
  const handleFolderChange = (v: string) => { setFolder(v); navigatePage(1); };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Xóa ảnh "${item.filename}"?`)) return;
    try {
      await deleteMedia(item.id);
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(item.id); return n; });
      toast.success("Đã xóa ảnh", { description: item.filename });
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleUpdate = async (item: MediaItem, data: { filename?: string; alt?: string | null }) => {
    try {
      await updateMediaMeta({ id: item.id, ...data });
      toast.success("Đã cập nhật", {
        description: data.filename ? `Tên: ${data.filename}` : "Alt text đã lưu",
      });
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const toggleSelect = useCallback((item: MediaItem) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(item.id)) n.delete(item.id); else n.add(item.id);
      return n;
    });
  }, []);

  const selectAll = () => setSelectedIds(new Set(media.map((m) => m.id)));
  const clearSelect = () => setSelectedIds(new Set());

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Xóa ${selectedIds.size} ảnh đã chọn?`)) return;
    try {
      const result = await bulkDeleteMedia(Array.from(selectedIds));
      setSelectedIds(new Set());
      toast.success(`Đã xóa ${result.deleted} ảnh`, {
        description: result.failed > 0 ? `${result.failed} ảnh xóa thất bại` : undefined,
      });
    } catch {
      toast.error("Bulk delete thất bại");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Images size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Thư viện ảnh</h1>
            <p className="text-sm text-gray-500">Quản lý media lưu trên Vercel Blob</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw size={14} />
          Làm mới
        </Button>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Tổng số ảnh" value={stats?.totalCount ?? 0} />
        <StatCard label="Tổng dung lượng" value={formatBytes(stats?.totalSize ?? 0)} sub="toàn bộ store" />
        <StatCard
          label="Trang hiện tại"
          value={`${pagination?.page ?? 1} / ${pagination?.totalPages ?? 1}`}
          sub={`${pagination?.total ?? 0} kết quả`}
        />
        <StatCard
          label="Định dạng phổ biến"
          value={
            stats?.formatDistribution?.[0]
              ? `${mimeLabel(stats.formatDistribution[0].contentType)} (${stats.formatDistribution[0].count})`
              : "—"
          }
        />
      </div>

      {/* Format distribution badges */}
      {/* {stats?.formatDistribution && stats.formatDistribution.length > 0 && (
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Phân bố định dạng</p>
          <div className="flex flex-wrap gap-3">
            {stats.formatDistribution.map((f) => (
              <div key={f.contentType} className="flex items-center gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => { setContentType(contentType === f.contentType ? "all" : f.contentType); navigatePage(1); }}
                  className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                    contentType === f.contentType
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  {mimeLabel(f.contentType)} <span className="opacity-70">{f.count}</span>
                </button>
                <span className="text-gray-400 text-xs">{formatBytes(f.size)}</span>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Upload zone */}
      <div className="bg-white border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Upload ảnh mới</h2>
        <MediaUploader onUploadSuccess={() => refetch()} maxFiles={5} />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          {/* Search icon hoặc spinner */}
          {isLoading && debouncedSearch ? (
            <Loader2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />
          ) : (
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          )}
          <Input
            placeholder="Tìm kiếm theo tên file..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={isLoading}
            className="pl-9 pr-8 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {/* Indicator: đang chờ debounce */}
          {search !== debouncedSearch && search.length > 0 && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-gray-400 select-none">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              3s
            </span>
          )}
          {/* Nút xóa khi đã có text */}
          {search.length > 0 && search === debouncedSearch && !isLoading && (
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
                if (debounceRef.current) clearTimeout(debounceRef.current);
                navigatePage(1);
              }}
              title="Xóa tìm kiếm"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={14} className="text-gray-400" />
          <Select value={contentType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-44 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900">
              {CONTENT_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Folder dropdown */}
        {folders.length > 0 && (
          <div className="flex items-center gap-1.5">
            <FolderOpen size={14} className="text-gray-400" />
            <Select value={folder} onValueChange={handleFolderChange}>
              <SelectTrigger className="w-44 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900">
                <SelectItem value="all">Tất cả thư mục</SelectItem>
                {folders.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex gap-1 border rounded-lg p-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
            title="Xem dạng lưới"
          >
            <Grid size={14} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
            title="Xem dạng danh sách"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {media.length > 0 && (
        <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-2">
          <button
            type="button"
            onClick={selectedIds.size === media.length ? clearSelect : selectAll}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            {selectedIds.size === media.length && media.length > 0
              ? <CheckSquare size={15} className="text-blue-600" />
              : <Square size={15} />
            }
            {selectedIds.size === media.length && media.length > 0 ? "Bỏ chọn tất cả" : "Chọn tất cả"}
          </button>
          {selectedIds.size > 0 && (
            <>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-sm text-blue-600 font-medium">{selectedIds.size} ảnh đã chọn</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="ml-auto gap-1.5 h-7 text-xs"
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
              >
                <Trash2 size={12} />
                {isBulkDeleting ? "Đang xóa..." : `Xóa ${selectedIds.size} ảnh`}
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={clearSelect}>
                Hủy chọn
              </Button>
            </>
          )}
        </div>
      )}

      {/* Media content */}
      <div className="bg-white border rounded-xl p-5">
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <MediaGrid
            media={media}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            deletingIds={deletingIds}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        ) : (
          <div className="space-y-2">
            {media.length === 0 && (
              <p className="text-center text-gray-400 py-10 text-sm">Chưa có ảnh nào</p>
            )}
            {media.map((item) => {
              const isEditingThis = editingItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`border rounded-lg transition-colors ${
                    isEditingThis
                      ? "bg-blue-50 border-blue-300"
                      : selectedIds.has(item.id)
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  {/* Row chính */}
                  <div
                    className="flex items-center gap-3 p-3 cursor-pointer"
                    onClick={() => !isEditingThis && toggleSelect(item)}
                  >
                    {/* Checkbox */}
                    <div className="flex-shrink-0" onClick={(e) => { e.stopPropagation(); toggleSelect(item); }}>
                      {selectedIds.has(item.id)
                        ? <CheckSquare size={16} className="text-blue-600" />
                        : <Square size={16} className="text-gray-300 hover:text-gray-500" />
                      }
                    </div>

                    {/* Thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.alt ?? item.filename}
                      className="w-12 h-12 object-cover rounded border flex-shrink-0 cursor-zoom-in"
                      onClick={(e) => { e.stopPropagation(); /* lightbox handled by grid */ }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.filename}</p>
                      <p className="text-xs text-gray-400">
                        {mimeLabel(item.contentType)} · {formatBytes(item.size)}
                        {item.width && item.height && ` · ${item.width}×${item.height}px`}
                      </p>
                      {item.alt && (
                        <p className="text-xs text-gray-500 italic truncate">Alt: {item.alt}</p>
                      )}
                    </div>

                    {/* Date */}
                    <div className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 transition-colors ${
                          isEditingThis
                            ? "text-blue-600 bg-blue-100"
                            : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                        onClick={(e) => isEditingThis ? setEditingItem(null) : openListEdit(item, e)}
                        title={isEditingThis ? "Đóng" : "Chỉnh sửa"}
                      >
                        {isEditingThis ? <X size={14} /> : <Pencil size={14} />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(item)}
                        disabled={deletingIds.includes(item.id)}
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  {/* Inline edit panel */}
                  {isEditingThis && (
                    <div className="px-4 pb-3 pt-0 border-t border-blue-200 bg-white rounded-b-lg" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col sm:flex-row gap-3 mt-3">
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-600 block mb-1">Tên file</label>
                          <Input
                            value={editFilename}
                            onChange={(e) => setEditFilename(e.target.value)}
                            placeholder="Tên file..."
                            className="h-8 text-sm"
                            onKeyDown={(e) => { if (e.key === "Enter") saveListEdit(); if (e.key === "Escape") setEditingItem(null); }}
                            autoFocus
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-600 block mb-1">Alt text (SEO)</label>
                          <Input
                            value={editAlt}
                            onChange={(e) => setEditAlt(e.target.value)}
                            placeholder="Mô tả ảnh..."
                            className="h-8 text-sm"
                            onKeyDown={(e) => { if (e.key === "Enter") saveListEdit(); if (e.key === "Escape") setEditingItem(null); }}
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={saveListEdit}
                          >
                            <Check size={13} /> Lưu
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => setEditingItem(null)}
                          >
                            Hủy
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <PaginationComponent pageCount={pagination.totalPages} />
      )}
    </div>
  );
}

export default function AdminMediaPage() {
  return (
    <Suspense>
      <AdminMediaPageInner />
    </Suspense>
  );
}
