import type { PostType } from "@generated/prisma/client";

// Re-export enum để dùng ở client mà không import từ generated/
export { PostType };

// ─── ProjectMeta JSON shape ───────────────────────────────────────────────────
export type ProjectMeta = {
  nameOfProject?: string;
  addressOfProperty?: string;
  completedYear?: string;
  floorDimension?: number;
  numberOfFloors?: number;
  propertyType?: string;
  designedCompany?: string;
  isCompleted?: boolean;
  isFeatured?: boolean;
};

// ─── Response shapes (API → client) ──────────────────────────────────────────
export type CategoryResponse = {
  id: string;
  name: string;
  slug: string;
};

export type TagResponse = {
  id: string;
  name: string;
  slug: string;
};

export type AuthorResponse = {
  name: string;
};

export type PostResponse = {
  id: string;
  type: PostType;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  isPublished: boolean;
  metaTitle: string | null;
  metaDesc: string | null;
  metaKeywords: string | null;
  projectMeta: ProjectMeta | null;
  author: AuthorResponse;
  categories: CategoryResponse[];
  tags: TagResponse[];
  createdAt: string;
  updatedAt: string;
};

export type PostListResponse = {
  posts: PostResponse[];
  pageInfo: {
    total: number;
    hasMore: boolean;
    hasPrevious: boolean;
  };
};

// ─── Query params ─────────────────────────────────────────────────────────────
export type PostQueryParams = {
  type?: PostType;
  page?: number;
  size?: number;
  showAll?: boolean;      // admin: bao gồm cả draft
  isFeatured?: boolean;   // chỉ cho PROJECT_POST
  isCompleted?: boolean;  // chỉ cho PROJECT_POST
};

// ─── Prisma relation type (dùng trong service + transform) ───────────────────
export type PostWithRelations = {
  id: string;
  type: PostType;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  isPublished: boolean;
  metaTitle: string | null;
  metaDesc: string | null;
  metaKeywords: string | null;
  projectMeta: unknown; // Prisma Json → cast về ProjectMeta trong transform
  authorId: string;
  author: { name: string };
  categories: CategoryResponse[];
  tags: TagResponse[];
  createdAt: Date;
  updatedAt: Date;
};
