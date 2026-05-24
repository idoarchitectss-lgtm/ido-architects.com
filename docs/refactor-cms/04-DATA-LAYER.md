# 04 — Data Layer & CMS Architecture

## Nguyên tắc kiến trúc

> ✅ **Mọi data fetching đều phải đi qua API Route** — không gọi Prisma trực tiếp từ Server Components hay Client Components.
>
> Lý do:
> - Tách biệt rõ ràng giữa tầng **presentation** và tầng **data**
> - API Route có thể dùng lại cho mobile app, third-party sau này
> - Dễ test từng layer độc lập
> - Admin CMS và public frontend đều dùng chung một API

---

## Cấu trúc thư mục (Feature-based Architecture)

```
src/
├── app/
│   ├── api/                          ← API Routes (HTTP handlers thuần túy)
│   │   ├── posts/
│   │   │   ├── route.ts              # GET /api/posts, POST /api/posts
│   │   │   └── [slug]/
│   │   │       └── route.ts          # GET, PUT, DELETE /api/posts/[slug]
│   │   ├── portfolios/
│   │   │   ├── route.ts
│   │   │   └── [slug]/route.ts
│   │   ├── portfolio-categories/
│   │   │   └── route.ts
│   │   ├── services/
│   │   │   ├── route.ts
│   │   │   └── [slug]/route.ts
│   │   ├── hero/route.ts
│   │   └── about/route.ts
│   │
│   └── admin/                        ← CMS Pages (gọi API qua hooks)
│       ├── posts/
│       ├── portfolios/
│       └── ...
│
└── features/                         ← Feature modules (tổ chức theo domain)
    ├── posts/
    │   ├── types/
    │   │   └── post.types.ts         # TypeScript types/interfaces
    │   ├── validations/
    │   │   └── post.schema.ts        # Zod schemas
    │   ├── services/
    │   │   └── post.service.ts       # Prisma queries (server-only)
    │   ├── transforms/
    │   │   └── post.transform.ts     # DB model → API response shape
    │   ├── helpers/
    │   │   └── post.helpers.ts       # Utilities (slug gen, format...)
    │   ├── hooks/
    │   │   └── usePost.ts            # TanStack Query hooks (client)
    │   └── components/
    │       ├── PostForm.tsx
    │       └── PostList.tsx
    ├── portfolios/
    │   └── ... (cùng cấu trúc)
    ├── services/
    │   └── ...
    ├── hero/
    │   └── ...
    └── about/
        └── ...
```

---

## Luồng dữ liệu

```
[Server/Client Component]
        │
        │ gọi
        ▼
[hooks/usePost.ts]                ← TanStack Query (client-side)
        │                         hoặc fetch() trực tiếp (server component)
        │ HTTP request
        ▼
[app/api/posts/slug/[slug]]       ← Public: nhận slug
        │   OR
[app/api/posts/[id]]              ← Admin: nhận id
        │
        │ Public path                      Admin path
        ├─ resolveSlugToId(slug)            │
        │   SELECT id WHERE slug=?          │
        │   (lightweight, index on slug)    │
        │         │                         │
        │         ▼                         ▼
        └──── postService.findById(id) ─────┘
                   WHERE id = ?
                   (PK lookup, fastest)
                         │
                         ▼
              [PostgreSQL via Prisma]
                         │
                         ▼
              [transforms/post.transform.ts]
                         │
                         ▼
              [NextResponse.json(PostResponse)]
```

---

## Layer 1 — Types (`features/posts/types/post.types.ts`)

```typescript
import type { Post, Category, Tag, User, PostType } from "@prisma/client";

// Cấu trúc projectMeta cho PROJECT_POST
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

// Response shape trả về từ API (dùng chung cho cả blog lẫn project)
export type PostResponse = {
  id: string;
  type: PostType;                    // "BLOG_POST" | "PROJECT_POST"
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
  projectMeta: ProjectMeta | null;   // chỉ có giá trị khi type = PROJECT_POST
  author: { name: string | null };
  categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
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

// Prisma model với relations (dùng nội bộ trong service)
export type PostWithRelations = Post & {
  author: Pick<User, "name">;
  categories: Pick<Category, "id" | "name" | "slug">[];
  tags: Pick<Tag, "id" | "name" | "slug">[];
};

// Query params cho GET list
export type PostQueryParams = {
  page?: number;
  size?: number;
  type?: PostType;
  isPublished?: boolean;
  isFeatured?: boolean;    // filter trong projectMeta JSON
  isCompleted?: boolean;   // filter trong projectMeta JSON
};
```

---

## Layer 2 — Validations (`features/posts/validations/post.schema.ts`)

```typescript
import * as z from "zod";
import { PostType } from "@prisma/client";

const ProjectMetaSchema = z.object({
  nameOfProject:     z.string().optional(),
  addressOfProperty: z.string().optional(),
  completedYear:     z.string().optional(),
  floorDimension:    z.coerce.number().positive().optional(),
  numberOfFloors:    z.coerce.number().int().positive().optional(),
  propertyType:      z.string().optional(),
  designedCompany:   z.string().optional(),
  isCompleted:       z.boolean().optional(),
  isFeatured:        z.boolean().optional(),
}).optional().nullable();

export const PostSchema = z.object({
  type: z.nativeEnum(PostType).default("BLOG_POST"),
  title: z.string().min(3, "Tiêu đề ít nhất 3 ký tự").max(200),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug chỉ gồm chữ thường, số và dấu gạch ngang",
    }),
  excerpt:       z.string().max(500).optional().nullable(),
  content:       z.string().optional().nullable(),
  featuredImage: z.string().url("URL ảnh không hợp lệ").optional().nullable(),
  isPublished:   z.boolean().default(false),
  publishedAt:   z.string().datetime().optional().nullable(),
  metaTitle:     z.string().max(60).optional().nullable(),
  metaDesc:      z.string().max(160).optional().nullable(),
  metaKeywords:  z.string().optional().nullable(),
  projectMeta:   ProjectMetaSchema,   // chỉ điền khi type = PROJECT_POST
  authorId:      z.string().cuid(),
  categories:    z.array(z.string().cuid()).optional().default([]),
  tags:          z.array(z.string().cuid()).optional().default([]),
}).refine(
  (data) => {
    // Nếu là PROJECT_POST thì bắt buộc có featuredImage
    if (data.type === "PROJECT_POST") return !!data.featuredImage;
    return true;
  },
  { message: "Dự án phải có ảnh đại diện", path: ["featuredImage"] }
);

export const PostUpdateSchema = PostSchema.partial().omit({ authorId: true });

export const PostQuerySchema = z.object({
  page:        z.coerce.number().int().positive().default(1),
  size:        z.coerce.number().int().min(1).max(100).default(10),
  type:        z.nativeEnum(PostType).optional(),
  isFeatured:  z.coerce.boolean().optional(),  // lọc projectMeta.isFeatured
  isCompleted: z.coerce.boolean().optional(),  // lọc projectMeta.isCompleted
  showAll:     z.coerce.boolean().optional(),  // admin: hiện cả draft
});

export type PostInput = z.infer<typeof PostSchema>;
export type PostUpdateInput = z.infer<typeof PostUpdateSchema>;
export type PostQuery = z.infer<typeof PostQuerySchema>;
```

---

## Layer 3 — Services (`features/posts/services/post.service.ts`)

> Server-only. Chỉ được import trong API Routes, **không** import trong Client Components.  
> Mọi query chính đều dùng `id` (PK). Slug chỉ dùng trong `resolveSlugToId` để lấy id trước.

```typescript
// src/features/posts/services/post.service.ts
import "server-only";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { PostInput, PostUpdateInput, PostQuery } from "../validations/post.schema";
import type { PostWithRelations } from "../types/post.types";

const postInclude = {
  author: { select: { name: true } },
  categories: { select: { id: true, name: true, slug: true } },
  tags: { select: { id: true, name: true, slug: true } },
} as const;

export const postService = {
  // ─── READ ──────────────────────────────────────────────────────

  async findMany(query: PostQuery) {
    const { page, size, type, isFeatured, isCompleted, showAll } = query;
    const skip = (page - 1) * size;

    const where: Prisma.PostWhereInput = {
      ...(showAll ? {} : { isPublished: true }),
      ...(type && { type }),
      // Filter JSON field projectMeta (Prisma path filter)
      ...(isFeatured !== undefined && {
        projectMeta: { path: ["isFeatured"], equals: isFeatured },
      }),
      ...(isCompleted !== undefined && {
        projectMeta: { path: ["isCompleted"], equals: isCompleted },
      }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: size,
        orderBy: { publishedAt: "desc" },
        include: postInclude,
      }),
      prisma.post.count({ where }),
    ]);

    return { posts: posts as PostWithRelations[], total };
  },

  // Query chính — luôn dùng id (PK), O(1)
  async findById(id: string): Promise<PostWithRelations | null> {
    return prisma.post.findUnique({
      where: { id },
      include: postInclude,
    }) as Promise<PostWithRelations | null>;
  },

  // Resolve slug → id: chỉ SELECT id, rất nhẹ
  // Dùng ở public route trước khi gọi findById
  async resolveSlugToId(slug: string): Promise<string | null> {
    const row = await prisma.post.findUnique({
      where: { slug },
      select: { id: true }, // chỉ lấy id, không join gì cả
    });
    return row?.id ?? null;
  },

  // ─── WRITE ─────────────────────────────────────────────────────

  async create(data: PostInput): Promise<PostWithRelations> {
    const { categories, tags, ...rest } = data;
    return prisma.post.create({
      data: {
        ...rest,
        publishedAt: data.isPublished ? new Date().toISOString() : null,
        categories: { connect: categories?.map((id) => ({ id })) },
        tags: { connect: tags?.map((id) => ({ id })) },
      },
      include: postInclude,
    }) as Promise<PostWithRelations>;
  },

  // Update luôn nhận id — admin biết id từ danh sách
  async update(id: string, data: PostUpdateInput): Promise<PostWithRelations> {
    const { categories, tags, ...rest } = data;
    return prisma.post.update({
      where: { id },
      data: {
        ...rest,
        ...(data.isPublished !== undefined && {
          publishedAt: data.isPublished ? new Date().toISOString() : null,
        }),
        ...(categories && {
          categories: { set: categories.map((id) => ({ id })) },
        }),
        ...(tags && {
          tags: { set: tags.map((id) => ({ id })) },
        }),
      },
      include: postInclude,
    }) as Promise<PostWithRelations>;
  },

  // Delete luôn nhận id
  async delete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  },

  // ─── UTILS ─────────────────────────────────────────────────────

  async isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
    const row = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!row) return false;
    return row.id !== excludeId;
  },
};
```

> **Tại sao 2 bước thay vì `findUnique({ where: { slug } })`?**
>
> | | `findUnique({ where: { slug } })` | `resolveSlugToId` + `findById` |
> |---|---|---|
> | Index dùng | Unique index trên `slug` (string) | Unique index trên `slug` → sau đó PK (`id`) |
> | Join relations | 1 query với full include | Tách: query nhẹ trước, full query sau |
> | Reusability | Không | `resolveSlugToId` tái dùng được ở middleware, sitemap |
> | Cache granular | Không | Cache `id` riêng, `post data` riêng |

---

## Layer 4 — Transforms (`features/posts/transforms/post.transform.ts`)

```typescript
// src/features/posts/transforms/post.transform.ts
import type { PostWithRelations, PostResponse, PostListResponse, ProjectMeta } from "../types/post.types";

export function transformPost(post: PostWithRelations): PostResponse {
  return {
    id:            post.id,
    type:          post.type,
    title:         post.title,
    slug:          post.slug,
    excerpt:       post.excerpt,
    content:       post.content,
    featuredImage: post.featuredImage,
    publishedAt:   post.publishedAt?.toISOString() ?? null,
    isPublished:   post.isPublished,
    metaTitle:     post.metaTitle,
    metaDesc:      post.metaDesc,
    metaKeywords:  post.metaKeywords,
    // Cast JSON field về đúng type
    projectMeta:   (post.projectMeta as ProjectMeta) ?? null,
    author:        { name: post.author.name },
    categories:    post.categories,
    tags:          post.tags,
    createdAt:     post.createdAt.toISOString(),
    updatedAt:     post.updatedAt.toISOString(),
  };
}

export function transformPostList(
  posts: PostWithRelations[],
  total: number,
  page: number,
  size: number
): PostListResponse {
  return {
    posts: posts.map(transformPost),
    pageInfo: {
      total,
      hasMore: (page - 1) * size + posts.length < total,
      hasPrevious: page > 1,
    },
  };
}
```

---

## Layer 5 — Helpers (`features/posts/helpers/post.helpers.ts`)

```typescript
// src/features/posts/helpers/post.helpers.ts

/**
 * Tự động tạo slug từ tiêu đề tiếng Việt
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")    // bỏ dấu tiếng Việt
    .replace(/đ/g, "d").replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")       // chỉ giữ chữ, số, khoảng trắng
    .replace(/\s+/g, "-")               // khoảng trắng → gạch ngang
    .replace(/-+/g, "-")                // nhiều gạch ngang → một
    .trim();
}

/**
 * Tạo excerpt tự động từ content HTML
 */
export function generateExcerpt(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

/**
 * Tính thời gian đọc ước tính
 */
export function estimateReadingTime(html: string): number {
  const wordCount = html.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200)); // ~200 từ/phút
}
```

---

## Layer 6 — API Routes (`app/api/posts/`)

> API Route chỉ làm 3 việc: **validate request → gọi service → transform response**  
> Xem code đầy đủ tại [03-API-ROUTES.md](./03-API-ROUTES.md)

```
GET  /api/posts              → postService.findMany()
POST /api/posts              → postService.create()

# Public — nhận slug, resolve nội bộ
GET  /api/posts/slug/[slug]  → postService.resolveSlugToId(slug)
                                → postService.findById(id)

# Admin — nhận id trực tiếp
GET    /api/posts/[id]       → postService.findById(id)
PUT    /api/posts/[id]       → postService.update(id, data)
DELETE /api/posts/[id]       → postService.delete(id)
```

```typescript
// src/app/api/posts/slug/[slug]/route.ts
export async function GET(_req: NextRequest, { params }) {
  // 1. Slug → id (chỉ SELECT id, lightweight)
  const id = await postService.resolveSlugToId(params.slug);
  if (!id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // 2. Query chính bằng PK
  const post = await postService.findById(id);
  if (!post?.isPublished) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(transformPost(post));
}
```

---

## Layer 7 — Hooks (`features/posts/hooks/usePost.ts`)

### Cài đặt TanStack Query
```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

### Provider `src/providers/QueryProvider.tsx`
```typescript
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  }));
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Hooks `features/posts/hooks/usePost.ts`
```typescript
// src/features/posts/hooks/usePost.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostResponse, PostListResponse } from "../types/post.types";
import type { PostInput, PostUpdateInput } from "../validations/post.schema";

const QUERY_KEYS = {
  all: ["posts"] as const,
  list: (params: Record<string, unknown>) => ["posts", "list", params] as const,
  // Public dùng slug làm key (user-facing URL)
  detailBySlug: (slug: string) => ["posts", "slug", slug] as const,
  // Admin dùng id làm key
  detailById: (id: string) => ["posts", "id", id] as const,
};

// ─── PUBLIC HOOKS ────────────────────────────────────

// Lấy danh sách bài viết — generic (public)
export function usePosts(page = 1, size = 10) {
  return useQuery<PostListResponse>({
    queryKey: QUERY_KEYS.list({ page, size }),
    queryFn: () =>
      fetch(`/api/posts?page=${page}&size=${size}`).then((r) => r.json()),
  });
}

// Chỉ lấy blog posts (BLOG_POST)
export function useBlogPosts(page = 1, size = 10) {
  return useQuery<PostListResponse>({
    queryKey: QUERY_KEYS.list({ type: "BLOG_POST", page, size }),
    queryFn: () =>
      fetch(`/api/posts?type=BLOG_POST&page=${page}&size=${size}`).then((r) => r.json()),
  });
}

// Chỉ lấy project posts (PROJECT_POST) với filter tuỳ chọn
export function useProjectPosts(opts?: {
  isFeatured?: boolean;
  isCompleted?: boolean;
  page?: number;
  size?: number;
}) {
  const { isFeatured, isCompleted, page = 1, size = 10 } = opts ?? {};
  const params = new URLSearchParams({ type: "PROJECT_POST", page: String(page), size: String(size) });
  if (isFeatured !== undefined) params.set("isFeatured", String(isFeatured));
  if (isCompleted !== undefined) params.set("isCompleted", String(isCompleted));

  return useQuery<PostListResponse>({
    queryKey: QUERY_KEYS.list({ type: "PROJECT_POST", isFeatured, isCompleted, page, size }),
    queryFn: () => fetch(`/api/posts?${params.toString()}`).then((r) => r.json()),
  });
}

// Lấy chi tiết bài viết theo slug (public → route /api/posts/slug/[slug])
export function usePostBySlug(slug: string) {
  return useQuery<PostResponse>({
    queryKey: QUERY_KEYS.detailBySlug(slug),
    queryFn: () => fetch(`/api/posts/slug/${slug}`).then((r) => r.json()),
    enabled: !!slug,
  });
}

// ─── ADMIN HOOKS ─────────────────────────────────────

// Admin danh sách (kể cả draft), filter theo type nếu cần
export function useAdminPosts(opts?: { type?: "BLOG_POST" | "PROJECT_POST"; page?: number; size?: number }) {
  const { type, page = 1, size = 10 } = opts ?? {};
  const params = new URLSearchParams({ page: String(page), size: String(size), showAll: "true" });
  if (type) params.set("type", type);

  return useQuery<PostListResponse>({
    queryKey: ["admin", "posts", "list", { type, page, size }],
    queryFn: () => fetch(`/api/posts?${params.toString()}`).then((r) => r.json()),
  });
}

// Admin xem chi tiết theo id → /api/posts/[id]
export function useAdminPost(id: string) {
  return useQuery<PostResponse>({
    queryKey: QUERY_KEYS.detailById(id),
    queryFn: () => fetch(`/api/posts/${id}`).then((r) => r.json()),
    enabled: !!id,
  });
}

// Admin tạo bài viết
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation<PostResponse, Error, PostInput>({
    mutationFn: (data) =>
      fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error);
        return r.json();
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all }),
  });
}

// Admin cập nhật bài viết — dùng id
export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation<PostResponse, Error, PostUpdateInput>({
    mutationFn: (data) =>
      fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error);
        return r.json();
      }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detailById(id) });
      // Invalidate cả slug cache nếu slug thay đổi
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detailBySlug(updated.slug) });
    },
  });
}

// Admin xóa bài viết — dùng id
export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      fetch(`/api/posts/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok && r.status !== 204) throw new Error("Delete failed");
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all }),
  });
}
```

---

## Cách dùng trong Server Component (public pages)

```typescript
// src/app/(dynamicPages)/blog/[slug]/page.tsx
async function getPost(slug: string) {
  // Gọi route /api/posts/slug/[slug]
  // Nội bộ route này sẽ: resolveSlugToId → findById
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/posts/slug/${slug}`,
    { next: { tags: [`post-slug-${slug}`], revalidate: 120 } }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogDetailPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  // render ...
}
```

```typescript
// src/app/(dynamicPages)/blog/page.tsx — chỉ lấy BLOG_POST
async function getBlogPosts(page = 1) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/posts?type=BLOG_POST&page=${page}&size=10`,
    { next: { tags: ["blogs"], revalidate: 120 } }
  );
  return res.json();
}
```

```typescript
// src/app/(dynamicPages)/du-an/page.tsx — chỉ lấy PROJECT_POST
async function getProjectPosts(page = 1) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/posts?type=PROJECT_POST&page=${page}&size=10`,
    { next: { tags: ["projects"], revalidate: 120 } }
  );
  return res.json();
}
```

```typescript
// src/app/(dynamicPages)/du-an-noi-bat/page.tsx — featured projects
async function getFeaturedProjects() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/posts?type=PROJECT_POST&isFeatured=true`,
    { next: { tags: ["projects"], revalidate: 120 } }
  );
  return res.json();
}
```

---

## Bảng tổng hợp Layer Responsibility

| Layer | File | Nhiệm vụ | Chạy ở |
|---|---|---|---|
| **types** | `types/post.types.ts` | TypeScript interfaces, `PostType`, `ProjectMeta` | cả hai |
| **validations** | `validations/post.schema.ts` | Zod schemas, `ProjectMetaSchema`, form types | cả hai |
| **services** | `services/post.service.ts` | Prisma queries, JSON path filter, business logic | server only |
| **transforms** | `transforms/post.transform.ts` | DB model → API response, cast `projectMeta` | server only |
| **helpers** | `helpers/post.helpers.ts` | Slug gen, excerpt, utilities | cả hai |
| **api routes** | `app/api/posts/route.ts` | HTTP handler, auth check, type filter | server only |
| **hooks** | `hooks/usePost.ts` | `useBlogPosts`, `useProjectPosts`, admin hooks | client only |
| **components** | `components/PostForm.tsx` | UI, conditional `projectMeta` section | client |

> **Lưu ý:** Services, Hero, About không có feature folder — dùng `src/data/static/*.ts` thay thế.
