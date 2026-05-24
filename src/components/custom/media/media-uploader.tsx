"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants/media";
import type { MediaItem } from "@/features/media/types/media.types";
import { toast } from "sonner";

interface MediaUploaderProps {
  onUploadSuccess: (item: MediaItem) => void;
  maxFiles?: number;
  className?: string;
}

export function MediaUploader({
  onUploadSuccess,
  maxFiles = 5,
  className,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);

  const uploadFile = async (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type as never)) {
      toast.error("Định dạng không hỗ trợ", {
        description: "Chỉ chấp nhận JPEG, PNG, WebP, GIF, SVG",
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File quá lớn", { description: "Tối đa 10MB" });
      return;
    }

    const id = crypto.randomUUID();
    setQueue((q) => [...q, id]);
    setUploading(true);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/media/upload", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error("Upload thất bại", { description: body.error });
        return;
      }
      const item: MediaItem = await res.json();
      toast.success("Upload thành công!", { description: item.filename });
      onUploadSuccess(item);
    } finally {
      setQueue((q) => q.filter((i) => i !== id));
      setUploading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).slice(0, maxFiles);
    list.forEach(uploadFile);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => !uploading && inputRef.current?.click()}
      className={cn(
        "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors select-none",
        dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-400 hover:bg-gray-50",
        uploading && "pointer-events-none opacity-60",
        className
      )}
    >
      <Upload size={24} className={cn("text-gray-400", dragging && "text-blue-400")} />
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">
          {uploading
            ? `Đang upload ${queue.length} file...`
            : "Kéo thả ảnh vào đây hoặc click để chọn"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          JPEG, PNG, WebP, GIF, SVG — tối đa 10MB / file
          {maxFiles > 1 && ` — ${maxFiles} file cùng lúc`}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}
