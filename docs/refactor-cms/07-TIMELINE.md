# 07 — Timeline & Checklist

## Tổng quan

```
Tuần 1  →  Setup hạ tầng + Database + API Routes core
Tuần 2  →  Feature Posts (unified) + Admin CMS + Auth
Tuần 3  →  Static data files + Cleanup + Deploy
```

---

## ✅ Checklist chi tiết

### Tuần 1 — Hạ tầng & Core

#### Setup môi trường
- [ ] Tạo Neon DB (PostgreSQL serverless) tại console.neon.tech
- [ ] Cài packages: `prisma`, `@prisma/client`, `next-auth@beta`, `bcryptjs`, `server-only`
- [ ] Cài TanStack Query: `@tanstack/react-query`, `@tanstack/react-query-devtools`
- [ ] Cài TipTap: `@tiptap/react`, `@tiptap/starter-kit`, extensions
- [ ] Xóa packages cũ: `@upstash/redis`, `ws`, `bufferutil`
- [ ] Cập nhật `.env.local` với `DATABASE_URL`, `NEXTAUTH_SECRET`

#### Prisma Schema & Database
- [ ] Tạo `prisma/schema.prisma` — unified `Post` model + `PostType` enum (xem `02-PRISMA-SCHEMA.md`)
- [ ] Chạy `npx prisma migrate dev --name init`
- [ ] Tạo `src/lib/prisma.ts` (singleton client)
- [ ] Tạo `prisma/seed.ts` (tạo admin account)
- [ ] Chạy `npx prisma db seed` — xác nhận admin tạo thành công

#### QueryProvider
- [ ] Tạo `src/providers/QueryProvider.tsx`
- [ ] Thêm `<QueryProvider>` vào `src/app/layout.tsx`

---

### Tuần 1–2 — Feature: Posts (Blog + Project, unified)

#### Layer structure
- [ ] Tạo `src/features/posts/types/post.types.ts` — `PostType`, `ProjectMeta`, `PostResponse`
- [ ] Tạo `src/features/posts/validations/post.schema.ts` — `ProjectMetaSchema`, `.refine()` cho PROJECT_POST
- [ ] Tạo `src/features/posts/services/post.service.ts` — JSON path filter cho `isFeatured`, `isCompleted`
- [ ] Tạo `src/features/posts/transforms/post.transform.ts` — cast `projectMeta` JSON
- [ ] Tạo `src/features/posts/helpers/post.helpers.ts`

#### API Routes
- [ ] `src/app/api/posts/route.ts` (GET list với `?type=`, POST create)
- [ ] `src/app/api/posts/slug/[slug]/route.ts` (GET public — slug→id nội bộ)
- [ ] `src/app/api/posts/[id]/route.ts` (GET admin, PUT update, DELETE)
- [ ] `src/app/api/categories/route.ts` (GET, POST)

#### Hooks
- [ ] Tạo `src/features/posts/hooks/usePost.ts`
  - [ ] `useBlogPosts` — filter `?type=BLOG_POST`
  - [ ] `useProjectPosts` — filter `?type=PROJECT_POST&isFeatured=&isCompleted=`
  - [ ] `usePostBySlug` — public slug fetch
  - [ ] `useAdminPosts` — với type filter cho admin list
  - [ ] `useAdminPost`, `useCreatePost`, `useUpdatePost`, `useDeletePost`

#### Admin CMS UI
- [ ] `src/app/admin/posts/page.tsx` — danh sách (tab Blog / Dự án)
- [ ] `src/app/admin/posts/new/page.tsx` — tạo bài viết mới
- [ ] `src/app/admin/posts/[id]/page.tsx` — chỉnh sửa
- [ ] `src/features/posts/components/PostForm.tsx`
  - [ ] `type` selector (Blog / Dự án)
  - [ ] Conditional `projectMeta` section khi type = PROJECT_POST
  - [ ] `isFeatured`, `isCompleted` toggles
- [ ] `src/components/admin/TipTapEditor.tsx` — rich text editor

#### Public pages (kết nối API mới)
- [ ] `src/app/(dynamicPages)/blog/page.tsx` — gọi `/api/posts?type=BLOG_POST`
- [ ] `src/app/(dynamicPages)/blog/[slug]/page.tsx` — gọi `/api/posts/slug/[slug]`
- [ ] `src/app/(dynamicPages)/du-an/page.tsx` — gọi `/api/posts?type=PROJECT_POST`
- [ ] `src/app/(dynamicPages)/du-an/[slug]/page.tsx` — gọi `/api/posts/slug/[slug]`
- [ ] `src/app/(dynamicPages)/du-an-noi-bat/page.tsx` — `?type=PROJECT_POST&isFeatured=true`
- [ ] `src/app/(dynamicPages)/du-an-da-hoan-thien/page.tsx` — `?type=PROJECT_POST&isCompleted=true`

---

### Tuần 2 — Authentication & Admin Shell

- [ ] `src/lib/auth.ts` — NextAuth config
- [ ] `src/app/api/admin/auth/[...nextauth]/route.ts`
- [ ] `src/middleware.ts` — bảo vệ `/admin/*`
- [ ] `src/app/admin/layout.tsx` — sidebar với links Blog + Dự án
- [ ] `src/app/admin/login/page.tsx` — login form
- [ ] `src/app/admin/page.tsx` — dashboard (stats: tổng blog, tổng dự án, draft)

---

### Tuần 3 — Static Data Files + Cleanup

#### Static data files (thay cho CMS)
- [ ] Tạo `src/data/static/hero.ts` — hero banner content
- [ ] Tạo `src/data/static/about.ts` — giới thiệu công ty
- [ ] Tạo `src/data/static/services.ts` — danh sách dịch vụ
- [ ] Cập nhật các components tương ứng để đọc từ static files

#### Cleanup
- [ ] Xóa `src/lib/redis.ts`
- [ ] Xóa `src/lib/api.ts`
- [ ] Xóa `src/data/datafromWP.ts`
- [ ] Xóa `src/types/typeForWordpressData.ts`
- [ ] Xóa `src/app/api/refresh-token/`
- [ ] Cập nhật `next.config.mjs` (image domains)
- [ ] Cập nhật `src/app/sitemap.ts` — dùng DB thay WP
- [ ] Xóa env vars WordPress

#### Testing & Deploy
- [ ] Test public routes: blog list, blog detail, project list, project detail
- [ ] Test filtered routes: nổi bật, đã hoàn thành
- [ ] Test admin CRUD: tạo/sửa/xóa BLOG_POST và PROJECT_POST
- [ ] Test auth: login, middleware redirect
- [ ] Set env vars trên Vercel
- [ ] Deploy, chạy `prisma migrate deploy` trên production
- [ ] Nhập tay bài viết đầu tiên qua CMS

---

## Thứ tự ưu tiên nếu thời gian hạn chế

```
1. Prisma Schema + migrate          ← bắt buộc đầu tiên
2. Auth + Admin layout + Login      ← cần trước khi làm CMS
3. Feature Posts (đầy đủ)           ← blog là content chính
4. Feature Portfolios (đầy đủ)      ← showcase dự án quan trọng
5. Feature Services                 ← trang dịch vụ
6. Hero + About                     ← static content, ít thay đổi
7. Cleanup WP code                  ← cuối cùng, sau khi verify OK
```
