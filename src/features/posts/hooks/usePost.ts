"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostResponse, PostListResponse } from "../types/post.types";
import type { PostInput, PostUpdateInput } from "../validations/post.schema";

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const postKeys = {
  all: ["posts"] as const,
  list: (params: Record<string, unknown>) => ["posts", "list", params] as const,
  detailBySlug: (slug: string) => ["posts", "slug", slug] as const,
  detailById: (id: string) => ["posts", "id", id] as const,
  adminList: (params: Record<string, unknown>) => ["admin", "posts", "list", params] as const,
};

// ─── Fetch helpers ────────────────────────────────────────────────────────────
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Request failed");
  }
  return res.json();
}

// ─── PUBLIC HOOKS ─────────────────────────────────────────────────────────────

/** Tất cả bài viết (published) */
export function usePosts(page = 1, size = 10) {
  return useQuery<PostListResponse>({
    queryKey: postKeys.list({ page, size }),
    queryFn: () => fetchJSON(`/api/posts?page=${page}&size=${size}`),
  });
}

/** Chỉ BLOG_POST */
export function useBlogPosts(page = 1, size = 10) {
  return useQuery<PostListResponse>({
    queryKey: postKeys.list({ type: "BLOG_POST", page, size }),
    queryFn: () => fetchJSON(`/api/posts?type=BLOG_POST&page=${page}&size=${size}`),
  });
}

/** Chỉ PROJECT_POST với filter tuỳ chọn */
export function useProjectPosts(opts?: {
  isFeatured?: boolean;
  isCompleted?: boolean;
  page?: number;
  size?: number;
}) {
  const { isFeatured, isCompleted, page = 1, size = 10 } = opts ?? {};
  const params = new URLSearchParams({
    type: "PROJECT_POST",
    page: String(page),
    size: String(size),
  });
  if (isFeatured !== undefined) params.set("isFeatured", String(isFeatured));
  if (isCompleted !== undefined) params.set("isCompleted", String(isCompleted));

  return useQuery<PostListResponse>({
    queryKey: postKeys.list({ type: "PROJECT_POST", isFeatured, isCompleted, page, size }),
    queryFn: () => fetchJSON(`/api/posts?${params.toString()}`),
  });
}

/** Chi tiết theo slug (public) */
export function usePostBySlug(slug: string) {
  return useQuery<PostResponse>({
    queryKey: postKeys.detailBySlug(slug),
    queryFn: () => fetchJSON(`/api/posts/slug/${slug}`),
    enabled: !!slug,
  });
}

// ─── ADMIN HOOKS ──────────────────────────────────────────────────────────────

/** Admin: danh sách (bao gồm draft), filter theo type */
export function useAdminPosts(opts?: {
  type?: "BLOG_POST" | "PROJECT_POST";
  page?: number;
  size?: number;
}) {
  const { type, page = 1, size = 10 } = opts ?? {};
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    showAll: "true",
  });
  if (type) params.set("type", type);

  return useQuery<PostListResponse>({
    queryKey: postKeys.adminList({ type, page, size }),
    queryFn: () => fetchJSON(`/api/posts?${params.toString()}`),
  });
}

/** Admin: chi tiết theo id */
export function useAdminPost(id: string) {
  return useQuery<PostResponse>({
    queryKey: postKeys.detailById(id),
    queryFn: () => fetchJSON(`/api/posts/${id}`),
    enabled: !!id,
  });
}

/** Admin: tạo bài viết */
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation<PostResponse, Error, PostInput>({
    mutationFn: (data) =>
      fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? "Create failed");
        return r.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

/** Admin: cập nhật bài viết theo id */
export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation<PostResponse, Error, PostUpdateInput>({
    mutationFn: (data) =>
      fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? "Update failed");
        return r.json();
      }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.detailById(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.detailBySlug(updated.slug) });
    },
  });
}

/** Admin: xóa bài viết theo id */
export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      fetch(`/api/posts/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok && r.status !== 204) throw new Error("Delete failed");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
