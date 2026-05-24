# 03 — API Routes (thay thế GraphQL WordPress)

> 📖 Xem chi tiết cách tổ chức layer (types, services, transforms, hooks...) tại [04-DATA-LAYER.md](./04-DATA-LAYER.md)

## Nguyên tắc truy vấn

> ✅ **Tất cả truy vấn DB đều dùng `id` (primary key)** — nhanh nhất vì dùng B-tree index trên PK.
>
> Khi nhận `slug` từ URL (public pages), bắt buộc qua bước **slug → id** trước:
> 1. `SELECT id FROM posts WHERE slug = ?` — lightweight, chỉ lấy `id`
> 2. Dùng `id` vừa lấy để chạy query chính với đầy đủ relations

```
URL slug ──► resolveSlugToId(slug) ──► id ──► findById(id, include)
                  (SELECT id only)              (query chính, by PK)
```

---

## Cấu trúc thư mục

```
src/app/api/
├── posts/
│   ├── route.ts                  # GET list (filter by type), POST create
│   ├── [id]/
│   │   └── route.ts              # GET, PUT, DELETE by id  (Admin)
│   └── slug/
│       └── [slug]/
│           └── route.ts          # GET by slug (Public — resolve slug→id)
├── categories/
│   └── route.ts                  # GET list, POST create
└── admin/
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts          # NextAuth handler
    └── upload/
        └── route.ts              # Image upload
```

> ✂️ **Không có API route** cho `services`, `hero`, `about`, `portfolioCategories` — những phần này dùng **static data** trong code.

---

## Posts API

### `GET /api/posts` — Danh sách (phân trang, filter theo type)
### `POST /api/posts` — Tạo mới (Admin)

```typescript
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { postService } from "@/features/posts/services/post.service";
import { transformPost, transformPostList } from "@/features/posts/transforms/post.transform";
import { PostSchema, PostQuerySchema } from "@/features/posts/validations/post.schema";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";

export async function GET(req: NextRequest) {
  const parsed = PostQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // type = "BLOG_POST" | "PROJECT_POST" | undefined (lấy tất cả)
  const { posts, total } = await postService.findMany(parsed.data);
  return NextResponse.json(
    transformPostList(posts, total, parsed.data.page, parsed.data.size)
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const post = await postService.create(parsed.data);
  // Revalidate đúng tag theo type
  revalidateTag("posts");
  revalidateTag(parsed.data.type === "PROJECT_POST" ? "projects" : "blogs");
  return NextResponse.json(transformPost(post), { status: 201 });
}
```

**Ví dụ gọi:**
```
GET /api/posts                          → tất cả
GET /api/posts?type=BLOG_POST           → chỉ blog
GET /api/posts?type=PROJECT_POST        → chỉ dự án
GET /api/posts?type=PROJECT_POST&isFeatured=true   → dự án nổi bật
GET /api/posts?type=PROJECT_POST&isCompleted=true  → dự án hoàn thiện
```

---

### `GET /api/posts/slug/[slug]` — Chi tiết theo slug (Public)

> Route dành cho **public frontend** (blog detail page).  
> Nhận `slug` → service **resolve sang `id`** → query chính bằng `id`.

```typescript
// src/app/api/posts/slug/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { postService } from "@/features/posts/services/post.service";
import { transformPost } from "@/features/posts/transforms/post.transform";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Bước 1: resolve slug → id (SELECT id only, lightweight)
  const id = await postService.resolveSlugToId(params.slug);
  if (!id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Bước 2: query chính bằng PK
  const post = await postService.findById(id);
  if (!post || !post.isPublished)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(transformPost(post));
}
```

---

### `GET /api/posts/[id]` — Chi tiết theo id (Admin)
### `PUT /api/posts/[id]` — Cập nhật (Admin)
### `DELETE /api/posts/[id]` — Xóa (Admin)

> Route dành cho **Admin CMS** — luôn dùng `id` trực tiếp, không cần resolve.

```typescript
// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { postService } from "@/features/posts/services/post.service";
import { transformPost } from "@/features/posts/transforms/post.transform";
import { PostUpdateSchema } from "@/features/posts/validations/post.schema";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";

// GET /api/posts/[id]  — Admin xem chi tiết (kể cả draft)
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const post = await postService.findById(params.id); // query bằng PK
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(transformPost(post));
}

// PUT /api/posts/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = PostUpdateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const existing = await postService.findById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await postService.update(params.id, parsed.data);

  // Revalidate cả tag list lẫn tag slug cụ thể
  revalidateTag("posts");
  revalidateTag(`post-slug-${existing.slug}`);

  return NextResponse.json(transformPost(updated));
}

// DELETE /api/posts/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await postService.findById(params.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await postService.delete(params.id);

  revalidateTag("posts");
  revalidateTag(`post-slug-${existing.slug}`);

  return new NextResponse(null, { status: 204 });
}
```

---

## Bảng tổng hợp API Routes

| Route | Method | Dùng bởi | Param | Truy vấn DB |
|---|---|---|---|---|
| `/api/posts` | GET | Public + Admin | `?type=`, `?page=`, `?size=`, `?isFeatured=`, `?isCompleted=` | `findMany` by filter |
| `/api/posts` | POST | Admin | body (có `type` field) | `create` |
| `/api/posts/slug/[slug]` | GET | Public | slug → **resolve → id** | `findById` (PK) |
| `/api/posts/[id]` | GET | Admin | id trực tiếp | `findById` (PK) |
| `/api/posts/[id]` | PUT | Admin | id trực tiếp | `update where id` (PK) |
| `/api/posts/[id]` | DELETE | Admin | id trực tiếp | `delete where id` (PK) |
| `/api/categories` | GET | Public + Admin | — | `findMany` |
| `/api/categories` | POST | Admin | body | `create` |

---

## Bảng mapping GraphQL → API Routes mới

| Hàm cũ (GraphQL) | API Route mới | Ghi chú |
|---|---|---|
| `getAllPosts(size, page)` | `GET /api/posts?type=BLOG_POST` | |
| `getSinglePost(slug)` | `GET /api/posts/slug/[slug]` | |
| `getAllPortfolios()` | `GET /api/posts?type=PROJECT_POST` | Gộp vào cùng bảng |
| `getSinglePortfolio(slug)` | `GET /api/posts/slug/[slug]` | Cùng route |
| `getPortfolioCates()` | `GET /api/categories` | Dùng chung Category |
| `getServices()` | — | **Static data** |
| `getSingleService(slug)` | — | **Static data** |
| `getHero()` | — | **Static data** |
| `getAbout()` | — | **Static data** |

---

## Caching với revalidateTag

```typescript
// Public page fetch có cache tag phân loại theo type
const res = await fetch(`${baseUrl}/api/posts?type=BLOG_POST&page=1`, {
  next: { tags: ["blogs"], revalidate: 120 },
});

const res2 = await fetch(`${baseUrl}/api/posts?type=PROJECT_POST`, {
  next: { tags: ["projects"], revalidate: 120 },
});

const res3 = await fetch(`${baseUrl}/api/posts/slug/${slug}`, {
  next: { tags: [`post-slug-${slug}`], revalidate: 120 },
});

// Khi admin tạo/sửa/xóa → revalidate đúng tag
revalidateTag("posts");                  // tất cả
revalidateTag("blogs");                  // chỉ blog list
revalidateTag("projects");               // chỉ project list
revalidateTag(`post-slug-${slug}`);      // trang chi tiết cụ thể
```
