"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Upload, Trash2, Check, ImageIcon, X } from "lucide-react";
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

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  /** Gọi khi người dùng chọn xong ảnh */
  onSelect: (url: string, item: MediaItem) => void;
  /** URL đang được chọn (để highlight) */
  selectedUrl?: string;
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MediaPicker({
  open,
  onClose,
  onSelect,
  selectedUrl,
}: MediaPickerProps) {
  const toast = useAdminToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

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
    if (open) fetchMedia();
  }, [open, fetchMedia]);

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
    setDeletingId(null);
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

        {/* Grid */}
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-400">Đang tải...</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center">
            <ImageIcon size={32} className="mx-auto text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">Chưa có ảnh nào. Upload ảnh đầu tiên!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[400px] overflow-y-auto pr-1">
            {items.map((item) => {
              const isSelected = item.url === selectedUrl;
              const isDeleting = deletingId === item.id;
              return (
                <div
                  key={item.id}
                  className="relative group aspect-square"
                  onMouseEnter={() => setHoverId(item.id)}
                  onMouseLeave={() => setHoverId(null)}
                >
                  {/* Image */}
                  <button
                    type="button"
                    onClick={() => onSelect(item.url, item)}
                    className={cn(
                      "w-full h-full rounded-md overflow-hidden border-2 transition-all",
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-300"
                        : "border-transparent hover:border-blue-300"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.alt ?? item.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-1 left-1 bg-blue-500 rounded-full p-0.5">
                      <Check size={10} className="text-white" />
                    </div>
                  )}

                  {/* Hover overlay: filename + delete */}
                  {(hoverId === item.id || isDeleting) && (
                    <div className="absolute inset-0 bg-black/40 rounded-md flex flex-col items-center justify-between p-1.5 pointer-events-none">
                      <p className="text-white text-[10px] leading-tight text-center line-clamp-2 w-full">
                        {item.filename}
                      </p>
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
          <Button variant="outline" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </AdminModal>
  );
}
