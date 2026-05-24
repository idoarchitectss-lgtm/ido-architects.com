"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Check, Pencil, CheckSquare, Square, X, ChevronLeft, ChevronRight, Download, Copy } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { MediaItem } from "@/features/media/types/media.types";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface LightboxProps {
  media: MediaItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function Lightbox({ media, index, onClose, onNavigate }: LightboxProps) {
  const item = media[index];

  const prev = useCallback(() => {
    if (index > 0) onNavigate(index - 1);
  }, [index, onNavigate]);

  const next = useCallback(() => {
    if (index < media.length - 1) onNavigate(index + 1);
  }, [index, media.length, onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const copyUrl = () => {
    navigator.clipboard.writeText(item.url).then(() => toast.success("Đã copy URL"));
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        title="Đóng (Esc)"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {index + 1} / {media.length}
      </div>

      {/* Prev */}
      {index > 0 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          title="Ảnh trước (←)"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Next */}
      {index < media.length - 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          title="Ảnh tiếp (→)"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.alt ?? item.filename}
          className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Bottom info bar */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4 flex items-end justify-between gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-white min-w-0">
          <p className="font-medium truncate">{item.filename}</p>
          <p className="text-xs text-white/60 mt-0.5">
            {formatBytes(item.size)}
            {item.width && item.height && ` · ${item.width}×${item.height}px`}
            {item.alt && ` · Alt: ${item.alt}`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={copyUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-white text-xs transition-colors"
            title="Copy URL"
          >
            <Copy size={13} /> Copy URL
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-white text-xs transition-colors"
            title="Mở trong tab mới"
          >
            <Download size={13} /> Tải về
          </a>
        </div>
      </div>
    </div>
  );
}


interface MediaGridProps {
  media: MediaItem[];
  selectedUrl?: string;
  onSelect?: (item: MediaItem) => void;
  onDelete?: (item: MediaItem) => void;
  /** Callback khi lưu filename hoặc alt */
  onUpdateAlt?: (item: MediaItem, alt: string) => void;
  onUpdate?: (item: MediaItem, data: { filename?: string; alt?: string | null }) => void;
  deletingIds?: string[];
  className?: string;
  /** Bulk-select mode: set of selected item IDs */
  selectedIds?: Set<string>;
  /** Called when user clicks the checkbox/item in bulk-select mode */
  onToggleSelect?: (item: MediaItem) => void;
}

export function MediaGrid({
  media,
  selectedUrl,
  onSelect,
  onDelete,
  onUpdateAlt,
  onUpdate,
  deletingIds = [],
  className,
  selectedIds,
  onToggleSelect,
}: MediaGridProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFilename, setEditFilename] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openEditor = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditFilename(item.filename);
    setEditAlt(item.alt ?? "");
  };

  const saveEdit = (item: MediaItem) => {
    if (onUpdate) {
      onUpdate(item, { filename: editFilename || undefined, alt: editAlt || null });
    } else {
      onUpdateAlt?.(item, editAlt);
    }
    setEditingId(null);
  };

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-sm">Chưa có ảnh nào</p>
      </div>
    );
  }

  return (
    <>
      {lightboxIndex !== null && (
        <Lightbox
          media={media}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
      <div className={cn("grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3", className)}>
      {media.map((item) => {
        const isSelected = item.url === selectedUrl;
        const isBulkSelected = selectedIds?.has(item.id) ?? false;
        const isDeleting = deletingIds.includes(item.id);
        const isEditing = editingId === item.id;

        return (
          <div
            key={item.id}
            className={cn(
              "group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer bg-gray-100 transition-all",
              isSelected ? "border-blue-500 ring-2 ring-blue-200" : 
              isBulkSelected ? "border-blue-500 ring-2 ring-blue-200" : 
              "border-transparent hover:border-gray-300",
              isDeleting && "opacity-50 pointer-events-none"
            )}
            onClick={() => onSelect ? onSelect(item) : setLightboxIndex(media.indexOf(item))}
          >
            {/* Thumbnail */}
            <Image
              src={item.url}
              alt={item.alt ?? item.filename}
              fill
              className="object-cover"
              sizes="150px"
              unoptimized
            />

            {/* Bulk-select checkbox — click riêng để toggle, không mở lightbox */}
            {onToggleSelect && (
              <div
                className="absolute top-1.5 left-1.5 z-20"
                onClick={(e) => { e.stopPropagation(); onToggleSelect(item); }}
                title={isBulkSelected ? "Bỏ chọn" : "Chọn ảnh"}
              >
                {isBulkSelected ? (
                  <CheckSquare size={18} className="text-blue-500 drop-shadow-md" />
                ) : (
                  <Square size={18} className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity" />
                )}
              </div>
            )}

            {/* Selected badge (single-select mode) */}
            {isSelected && !onToggleSelect && (
              <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5 z-10">
                <Check size={10} />
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 z-10">
              <div className="flex justify-end gap-1">
                {/* Edit */}
                {(onUpdateAlt || onUpdate) && (
                  <button
                    type="button"
                    onClick={(e) => openEditor(item, e)}
                    className="p-1 bg-white/20 hover:bg-white/40 rounded text-white"
                    title="Chỉnh sửa tên & alt"
                  >
                    <Pencil size={10} />
                  </button>
                )}
                {/* Delete */}
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                    className="p-1 bg-red-500/80 hover:bg-red-600 rounded text-white"
                    title="Xóa"
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
              <div className="text-white text-[10px] leading-tight">
                <p className="truncate font-medium">{item.filename}</p>
                <p className="opacity-75">{formatBytes(item.size)}</p>
              </div>
            </div>

            {/* Edit overlay — filename + alt */}
            {isEditing && (
              <div
                className="absolute inset-0 bg-black/85 z-20 flex flex-col justify-center p-2 gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-white/60 uppercase tracking-wide">Tên file</label>
                  <input
                    type="text"
                    value={editFilename}
                    onChange={(e) => setEditFilename(e.target.value)}
                    placeholder="Tên file..."
                    className="w-full text-xs rounded px-1.5 py-1 border outline-none bg-white text-gray-900"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(item);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-white/60 uppercase tracking-wide">Alt text</label>
                  <input
                    type="text"
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                    placeholder="Alt text..."
                    className="w-full text-xs rounded px-1.5 py-1 border outline-none bg-white text-gray-900"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(item);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                  />
                </div>
                <div className="flex gap-1 justify-end mt-0.5">
                  <button
                    type="button"
                    onClick={() => saveEdit(item)}
                    className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-[10px] bg-gray-500 text-white px-2 py-0.5 rounded hover:bg-gray-600"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </>
  );
}
