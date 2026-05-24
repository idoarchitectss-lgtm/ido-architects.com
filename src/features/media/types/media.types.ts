// ─── Media Item — kiểu dữ liệu chuẩn cho UI ─────────────────────────────────
export type MediaItem = {
  id: string;
  filename: string;
  url: string;
  contentType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  createdAt: string;
  uploader: { name: string | null };
};

// ─── Query params cho GET /api/media ─────────────────────────────────────────
export type MediaQuery = {
  page?: number;
  limit?: number;
  search?: string;
  contentType?: string; // "image/jpeg" | "image/png" | ...
  folder?: string;      // blob path prefix, e.g. "media"
};

// ─── Response phân trang ──────────────────────────────────────────────────────
export type MediaPagination = {
  page: number;
  totalPages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type MediaResponse = {
  media: MediaItem[];
  pagination: MediaPagination;
};

// ─── Payload khi upload ───────────────────────────────────────────────────────
export type MediaUploadPayload = {
  file: File;
  alt?: string;
};

// ─── Payload khi update metadata ─────────────────────────────────────────────
export type MediaUpdatePayload = {
  alt?: string;
};
