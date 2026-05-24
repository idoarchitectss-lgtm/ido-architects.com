"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import type {
  MediaItem,
  MediaQuery,
  MediaResponse,
} from "@/features/media/types/media.types";
import { MEDIA_PAGE_SIZE } from "@/lib/constants/media";

// ─── Types ────────────────────────────────────────────────────────────────────
export type MediaStats = {
  totalCount: number;
  totalSize: number;
  formatDistribution: { contentType: string; count: number; size: number }[];
};

// ─── Query key factory ────────────────────────────────────────────────────────
export const mediaKeys = {
  all: ["media"] as const,
  list: (params: MediaQuery) => ["media", "list", params] as const,
  stats: ["media", "stats"] as const,
  folders: ["media", "folders"] as const,
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────
async function fetchMedia(params: MediaQuery): Promise<MediaResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.search) qs.set("search", params.search);
  if (params.contentType) qs.set("contentType", params.contentType);
  if (params.folder) qs.set("folder", params.folder);
  const res = await fetch(`/api/media?${qs.toString()}`);
  if (!res.ok) throw new Error("Lấy danh sách media thất bại");
  return res.json();
}

async function fetchStats(): Promise<MediaStats> {
  const res = await fetch("/api/media/stats");
  if (!res.ok) throw new Error("Lấy thống kê media thất bại");
  return res.json();
}

async function fetchFolders(): Promise<{ folders: string[] }> {
  const res = await fetch("/api/media/folders");
  if (!res.ok) throw new Error("Lấy danh sách thư mục thất bại");
  return res.json();
}

// ─── useMedia hook ────────────────────────────────────────────────────────────
interface UseMediaOptions {
  defaultParams?: MediaQuery;
  onUploadSuccess?: (item: MediaItem) => void;
  onDeleteSuccess?: (id: string) => void;
}

export function useMedia(options: UseMediaOptions = {}) {
  const queryClient = useQueryClient();

  const [filterParams, setFilterParamsState] = useState<MediaQuery>({
    page: 1,
    limit: MEDIA_PAGE_SIZE,
    ...options.defaultParams,
  });

  const setFilterParams = useCallback((params: Partial<MediaQuery>) => {
    setFilterParamsState((prev) => ({ ...prev, ...params }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterParamsState({ page: 1, limit: MEDIA_PAGE_SIZE });
  }, []);

  // ─── Query list ──────────────────────────────────────────────────────────────
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: mediaKeys.list(filterParams),
    queryFn: () => fetchMedia(filterParams),
  });

  // ─── Query stats ─────────────────────────────────────────────────────────────
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: mediaKeys.stats,
    queryFn: fetchStats,
    staleTime: 30_000,
  });

  // ─── Query folders ────────────────────────────────────────────────────────────
  const { data: foldersData } = useQuery({
    queryKey: mediaKeys.folders,
    queryFn: fetchFolders,
    staleTime: 60_000,
  });

  // ─── Upload mutation ──────────────────────────────────────────────────────────
  const [uploadProgress, setUploadProgress] = useState(0);

  const { mutateAsync: uploadMedia, isPending: isUploading } = useMutation({
    mutationFn: async ({ file, alt }: { file: File; alt?: string }) => {
      setUploadProgress(0);
      const form = new FormData();
      form.append("file", file);
      if (alt) form.append("alt", alt);
      const res = await fetch("/api/media/upload", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Upload thất bại");
      }
      setUploadProgress(100);
      return res.json() as Promise<MediaItem>;
    },
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      options.onUploadSuccess?.(item);
    },
  });

  // ─── Update mutation ──────────────────────────────────────────────────────────
  const { mutateAsync: updateMediaMeta } = useMutation({
    mutationFn: async ({ id, alt, filename }: { id: string; alt?: string | null; filename?: string }) => {
      const res = await fetch(`/api/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt, filename }),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      return res.json() as Promise<MediaItem>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });

  // ─── Delete single ────────────────────────────────────────────────────────────
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const { mutateAsync: deleteMedia } = useMutation({
    mutationFn: async (id: string) => {
      setDeletingIds((prev) => [...prev, id]);
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Xóa thất bại");
      return id;
    },
    onSuccess: (id) => {
      setDeletingIds((prev) => prev.filter((d) => d !== id));
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      options.onDeleteSuccess?.(id);
    },
    onError: (_err, id) => {
      setDeletingIds((prev) => prev.filter((d) => d !== id));
    },
  });

  // ─── Bulk delete ──────────────────────────────────────────────────────────────
  const { mutateAsync: bulkDeleteMedia, isPending: isBulkDeleting } = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch("/api/media/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("Bulk delete thất bại");
      return res.json() as Promise<{ deleted: number; failed: number }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });

  return {
    // Data
    media: data?.media ?? [],
    pagination: data?.pagination,
    stats,
    folders: foldersData?.folders ?? [],
    isLoading,
    isError,
    error,

    // Filter
    filterParams,
    setFilterParams,
    resetFilters,

    // Actions
    uploadMedia,
    updateMediaMeta,
    deleteMedia,
    bulkDeleteMedia,
    refetch: () => { refetch(); refetchStats(); },

    // States
    isUploading,
    uploadProgress,
    isDeleting: deletingIds.length > 0,
    deletingIds,
    isBulkDeleting,
  };
}
