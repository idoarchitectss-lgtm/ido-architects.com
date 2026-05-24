import "server-only";
import { prisma } from "@/lib/prisma";
import { MEDIA_PAGE_SIZE } from "@/lib/constants/media";

// ─── Shared select ────────────────────────────────────────────────────────────
const mediaSelect = {
  id: true,
  filename: true,
  url: true,
  contentType: true,
  size: true,
  width: true,
  height: true,
  alt: true,
  createdAt: true,
  uploader: { select: { name: true } },
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MediaCreateInput {
  filename: string;
  url: string;
  contentType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  uploadedBy: string;
}

export interface MediaFindOptions {
  page?: number;
  limit?: number;
  search?: string;
  contentType?: string;
  folder?: string;
}

// ─── List (phân trang + tìm kiếm) ────────────────────────────────────────────
export async function findAllMedia(opts: MediaFindOptions = {}) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, opts.limit ?? MEDIA_PAGE_SIZE);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (opts.search) {
    where.filename = { contains: opts.search, mode: "insensitive" };
  }
  if (opts.contentType) {
    where.contentType = opts.contentType;
  }
  if (opts.folder) {
    // Blob URL pattern: https://xxx.public.blob.vercel-storage.com/{folder}/timestamp-filename
    where.url = { contains: `/${opts.folder}/` };
  }

  const [items, total] = await prisma.$transaction([
    prisma.media.findMany({
      where,
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      select: mediaSelect,
    }),
    prisma.media.count({ where }),
  ]);

  return {
    media: items.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })),
    pagination: {
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      total,
      hasNext: skip + limit < total,
      hasPrev: page > 1,
    },
  };
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createMedia(data: MediaCreateInput) {
  const item = await prisma.media.create({ data, select: mediaSelect });
  return { ...item, createdAt: item.createdAt.toISOString() };
}

// ─── Update metadata ──────────────────────────────────────────────────────────
export async function updateMedia(id: string, data: { filename?: string; alt?: string | null }) {
  const item = await prisma.media.update({
    where: { id },
    data,
    select: mediaSelect,
  });
  return { ...item, createdAt: item.createdAt.toISOString() };
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteMedia(id: string) {
  return prisma.media.delete({ where: { id } });
}

// ─── Find by id ───────────────────────────────────────────────────────────────
export async function findMediaById(id: string) {
  return prisma.media.findUnique({ where: { id } });
}
