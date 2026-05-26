"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Upload, Trash2, Check, ImageIcon, X, LayoutGrid, Image as ImageIcon2 } from "lucide-react";
import AdminModal from "@/app/dashboard/admin/_components/AdminModal";
import { Button } from "@/components/ui/button";
import { useAdminToast } from "@/app/dashboard/admin/_hooks/useAdminToast";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  contentType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  createdAt: string;
  uploader: { name: string };
}

export type ImageLayoutCols = 1 | 2 | 3;

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  /** Gọi khi người dùng chọn xong ảnh (mode đơn) */
  onSelect: (url: string, item: MediaItem) => void;
  /** Gọi khi chèn nhiều ảnh theo layout */
  onSelectMultiple?: (urls: string[], cols: ImageLayoutCols) => void;
  /** URL đang được chọn (để highlight) */
  selectedUrl?: string;
  /** Mode mặc định khi mở modal */
  initialMode?: "single" | "layout";
  /** Hiển thị banner gợi ý ở trên lưới ảnh (ví dụ: hướng dẫn pick before/after) */
  hint?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ onUploaded }: { onUploaded: (item: MediaItem) => void }) {
  const toast = useAdminToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/media/upload", { method: "POST", body: form });
    setUploading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error("Upload thất bại", typeof body.error === "string" ? body.error : undefined);
      return;
    }
    const item: MediaItem = await res.json();
    toast.success("Upload thành công!", item.filename);
    onUploaded(item);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors select-none",
        dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-400 hover:bg-gray-50",
        uploading && "pointer-events-none opacity-60"
      )}
    >
      <Upload size={20} className="text-gray-400" />
      <p className="text-sm text-gray-500">
        {uploading ? "Đang upload..." : "Kéo thả ảnh vào đây hoặc click để chọn"}
      </p>
      <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF, SVG — tối đa 10MB</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Layout preview option ────────────────────────────────────────────────────
function LayoutOption({ cols, active, onClick }: { cols: ImageLayoutCols; active: boolean; onClick: () => void }) {
  const label = cols === 1 ? "Ảnh đơn" : cols === 2 ? "2 cột" : "3 cột";
  const preview =
    cols === 1 ? (
      <div className="w-full h-4 rounded bg-current opacity-60" />
    ) : cols === 2 ? (
      <div className="flex gap-0.5 w-full">
        <div className="flex-1 h-4 rounded bg-current opacity-60" />
        <div className="flex-1 h-4 rounded bg-current opacity-60" />
      </div>
    ) : (
      <div className="flex gap-0.5 w-full">
        <div className="flex-1 h-4 rounded bg-current opacity-60" />
        <div className="flex-1 h-4 rounded bg-current opacity-60" />
        <div className="flex-1 h-4 rounded bg-current opacity-60" />
      </div>
    );
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all w-20",
        active ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      {preview}
      <span>{label}</span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MediaPicker({
  open,
  onClose,
  onSelect,
  onSelectMultiple,
  selectedUrl,
  initialMode = "single",
  hint,
}: MediaPickerProps) {
  const toast = useAdminToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  // Mode: single = chọn 1 ảnh, layout = chọn nhiều ảnh + layout
  const [mode, setMode] = useState<"single" | "layout">("single");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [layoutCols, setLayoutCols] = useState<ImageLayoutCols>(2);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media?limit=100");
      const data = await res.json();
      // API trả về { media: [...], pagination: {...} }
      setItems(Array.isArray(data?.media) ? data.media : Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchMedia();
      setSelectedIds(new Set());
      setMode(initialMode);
    }
  }, [open, fetchMedia, initialMode]);

  const handleDelete = async (item: MediaItem) => {
    setDeletingId(item.id);
    const res = await fetch(`/api/media/${item.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Xóa thất bại");
      setDeletingId(null);
      return;
    }
    toast.success("Đã xóa", item.filename);
    setItems((prev) => prev.filter((m) => m.id !== item.id));
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(item.id); return n; });
    setDeletingId(null);
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const handleInsertLayout = () => {
    if (selectedIds.size === 0) return;
    const urls = items.filter((i) => selectedIds.has(i.id)).map((i) => i.url);
    onSelectMultiple?.(urls, layoutCols);
    setSelectedIds(new Set());
    onClose();
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Thư viện ảnh"
      description="Chọn ảnh hoặc upload ảnh mới lên Vercel Blob"
      size="xl"
    >
      <div className="space-y-4">
        {/* Upload zone */}
        <UploadZone onUploaded={(item) => setItems((prev) => [item, ...prev])} />

        {/* Mode tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            type="button"
            onClick={() => { setMode("single"); setSelectedIds(new Set()); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              mode === "single" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <ImageIcon2 size={13} />
            Ảnh đơn
          </button>
          <button
            type="button"
            onClick={() => setMode("layout")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              mode === "layout" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <LayoutGrid size={13} />
            Nhiều ảnh
          </button>
        </div>

        {/* Layout picker (mode layout only) */}
        {mode === "layout" && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3 flex-wrap">
            <span className="text-xs font-medium text-blue-700 shrink-0">Chọn layout:</span>
            <div className="flex gap-2">
              {([1, 2, 3] as ImageLayoutCols[]).map((c) => (
                <LayoutOption key={c} cols={c} active={layoutCols === c} onClick={() => setLayoutCols(c)} />
              ))}
            </div>
            {selectedIds.size > 0 && (
              <span className="ml-auto text-xs text-blue-600 font-semibold">
                {selectedIds.size} ảnh đã chọn
              </span>
            )}
          </div>
        )}

        {/* Hint banner (e.g. for compare before/after flow) */}
        {hint && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2 text-sm font-medium">
            <span className="text-base">💡</span>
            {hint}
          </div>
        )}

        {/* Image grid */}
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-400">Đang tải...</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center">
            <ImageIcon size={32} className="mx-auto text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">Chưa có ảnh nào. Upload ảnh đầu tiên!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {items.map((item) => {
              const isSingleActive = mode === "single" && item.url === selectedUrl;
              const isMultiActive  = mode === "layout" && selectedIds.has(item.id);
              const isActive = isSingleActive || isMultiActive;
              const isDeleting = deletingId === item.id;
              const orderIdx = mode === "layout" ? Array.from(selectedIds).indexOf(item.id) : -1;

              return (
                <div
                  key={item.id}
                  className="relative group aspect-square"
                  onMouseEnter={() => setHoverId(item.id)}
                  onMouseLeave={() => setHoverId(null)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (mode === "single") { onSelect(item.url, item); onClose(); }
                      else toggleSelectItem(item.id);
                    }}
                    className={cn(
                      "w-full h-full rounded-md overflow-hidden border-2 transition-all",
                      isActive ? "border-blue-500 ring-2 ring-blue-300" : "border-transparent hover:border-blue-300"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.alt ?? item.filename} className="w-full h-full object-cover" loading="lazy" />
                  </button>

                  {/* Checkmark */}
                  {isActive && (
                    <div className="absolute top-1 left-1 bg-blue-500 rounded-full p-0.5 pointer-events-none">
                      <Check size={10} className="text-white" />
                    </div>
                  )}

                  {/* Order badge (multi mode) */}
                  {isMultiActive && (
                    <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] rounded px-1 font-bold pointer-events-none">
                      {orderIdx + 1}
                    </div>
                  )}

                  {/* Hover info overlay */}
                  {(hoverId === item.id || isDeleting) && (
                    <div className="absolute inset-0 bg-black/40 rounded-md flex flex-col items-center justify-between p-1.5 pointer-events-none">
                      <p className="text-white text-[10px] leading-tight text-center line-clamp-2 w-full">{item.filename}</p>
                      <p className="text-gray-300 text-[10px]">{formatBytes(item.size)}</p>
                    </div>
                  )}

                  {/* Delete button */}
                  {hoverId === item.id && !isDeleting && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  )}

                  {isDeleting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <p className="text-xs text-gray-400">{items.length} ảnh</p>
          <div className="flex gap-2">
            {mode === "layout" && onSelectMultiple && (
              <Button
                size="sm"
                disabled={selectedIds.size === 0}
                onClick={handleInsertLayout}
                className="gap-1.5"
              >
                <LayoutGrid size={13} />
                {selectedIds.size > 0
                  ? `Chèn ${selectedIds.size} ảnh${layoutCols > 1 ? ` (${layoutCols} cột)` : ""}`
                  : "Chèn ảnh"}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>Đóng</Button>
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
