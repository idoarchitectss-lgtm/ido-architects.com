# Hướng dẫn Agent Coding: Xây dựng chức năng CRUD Blog

> **Phiên bản tài liệu:** 1.0
> **Cập nhật lần cuối:** 2026-09-17
> **Áp dụng cho:** Chức năng quản lý bài viết (Blog / Dự án) — model `Post`
> **Đối tượng đọc:** AI coding agent (Claude Code, Cursor, ...) khi được giao build/mở rộng CRUD blog trong dự án này, hoặc build lại một CRUD tương tự (category, tag, media, ...) theo đúng kiến trúc đã có.

---

## Mục lục

1. [Nguyên tắc bắt buộc trước khi code](#1-nguyên-tắc-bắt-buộc-trước-khi-code)
2. [Kiến trúc tổng quan](#2-kiến-trúc-tổng-quan)
3. [Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
4. [Layer 1 — Prisma Schema](#4-layer-1--prisma-schema)
5. [Layer 2 — Validation (Zod)](#5-layer-2--validation-zod)
6. [Layer 3 — Service (data access)](#6-layer-3--service-data-access)
7. [Layer 4 — Transform (DTO)](#7-layer-4--transform-dto)
8. [Layer 5 — API Routes](#8-layer-5--api-routes)
9. [Layer 6 — Admin Hook (TanStack Query)](#9-layer-6--admin-hook-tanstack-query)
10. [Layer 7 — Admin UI (List / Create / Edit / Delete)](#10-layer-7--admin-ui-list--create--edit--delete)
11. [Auth & phân quyền](#11-auth--phân-quyền)
12. [Checklist: build một CRUD mới theo mẫu này](#12-checklist-build-một-crud-mới-theo-mẫu-này)
13. [Lỗi thường gặp / lưu ý](#13-lỗi-thường-gặp--lưu-ý)

---

## 1. Nguyên tắc bắt buộc trước khi code

- **Không tạo model/route/hook mới nếu đã có sẵn.** Blog CRUD đã được implement đầy đủ tại các đường dẫn liệt kê trong tài liệu này (model `Post`, feature `posts`, route `/api/posts`, trang `/dashboard/admin/posts`). Nếu task là "thêm field", "sửa bug", "thêm filter" — đọc code hiện có trước, chỉnh sửa tối thiểu, **không viết lại từ đầu**.
- **Đi đúng 7 layer** mô tả bên dưới, theo đúng thứ tự: Schema → Validation → Service → Transform → API Route → Hook → UI. Không gọi `prisma` trực tiếp trong route handler hoặc component — luôn qua service layer.
- **Không tạo abstraction thừa.** Đây là dự án nhỏ (feature-based, không dùng repository pattern phức tạp, không DI container). Giữ nguyên phong cách hàm thuần (plain async functions), không class.
- **Message lỗi & UI copy bằng tiếng Việt.** Toàn bộ label, placeholder, thông báo lỗi validate trong dự án đều tiếng Việt (xem `post.schema.ts`).
- **Không tự ý đổi route group** `(authenticated)` hay cấu trúc `dashboard/admin` — đây là route group Next.js để áp layout bảo vệ auth, không phải thư mục thường.
- Nếu tài liệu này và code thực tế lệch nhau (do code đã thay đổi sau khi viết doc), **ưu tiên code thực tế**, và nên cập nhật lại tài liệu này.

---

## 2. Kiến trúc tổng quan

```
                        ┌───────────────────────┐
                        │   PostgreSQL + Prisma  │
                        │      model Post        │
                        └───────────┬───────────┘
                                    │
                        ┌───────────▼───────────┐
                        │   Service Layer        │  src/features/posts/services/post.service.ts
                        │   (prisma queries)      │  findManyPosts, createPost, updatePost, deletePost...
                        └───────────┬───────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
  ┌─────────▼─────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
  │  Validation (Zod)  │   │  Transform (DTO)   │   │   API Routes       │
  │  post.schema.ts    │   │  post.transform.ts │   │  /api/posts/...    │
  └────────────────────┘   └────────────────────┘   └─────────┬─────────┘
                                                                │
                                                    ┌───────────▼───────────┐
                                                    │  Admin Hook (TanStack)  │
                                                    │  useAdminPosts.ts       │
                                                    └───────────┬───────────┘
                                                                │
                                                    ┌───────────▼───────────┐
                                                    │  Admin UI (Client)     │
                                                    │  List / PostForm /     │
                                                    │  DeletePostButton      │
                                                    └────────────────────────┘
```

**Post model dùng chung cho 2 loại nội dung** (field `type: PostType`):
- `BLOG_POST` — bài viết blog thường.
- `PROJECT_POST` — bài viết dự án kiến trúc, có thêm field JSON `projectMeta` (diện tích, số tầng, địa chỉ, gallery ảnh trước/sau...).

Khi build thêm tính năng cho "blog", cần xác định rõ đang thao tác trên `type: BLOG_POST` hay chung cho cả `Post` — phần lớn logic (list, create, update, delete) dùng chung, chỉ khác ở validate/hiển thị `projectMeta`.

---

## 3. Cấu trúc thư mục

```
prisma/schema.prisma                                    # model Post, Category, Tag

src/features/posts/
├── types/post.types.ts                                  # Response DTO + PostWithRelations
├── validations/post.schema.ts                            # Zod: Create/Update/Query schema
├── services/post.service.ts                              # prisma queries (server-only)
├── transforms/post.transform.ts                           # Prisma model -> Response DTO
├── helpers/post.helpers.ts                                # generateSlug, generateExcerpt, calcReadingTime (pure, no server-only)
└── hooks/usePost.ts                                       # hook public-facing (đọc bài viết ngoài site)

src/app/api/posts/
├── route.ts                                               # GET (list), POST (create)
├── [id]/route.ts                                          # GET, PUT, DELETE theo id (admin)
└── slug/[slug]/route.ts                                   # GET theo slug (public, đã published)

src/hooks/admin/posts/
└── useAdminPosts.ts                                       # TanStack Query hook cho trang admin list

src/app/dashboard/admin/
├── (authenticated)/
│   ├── layout.tsx                                         # check session, redirect /auth/login nếu chưa đăng nhập
│   └── posts/
│       ├── page.tsx                                        # danh sách bài viết (client component)
│       ├── new/page.tsx                                     # tạo mới
│       └── [id]/page.tsx                                     # sửa
└── _components/
    ├── PostForm.tsx                                        # form dùng chung cho create + edit
    ├── PostsFilterBar.tsx                                   # search + filter type
    ├── DeletePostButton.tsx                                 # confirm dialog + DELETE
    └── MediaPicker.tsx                                       # chọn ảnh từ media library
```

> Lưu ý: có một số thư mục cũ `src/app/admin/...` còn sót lại từ trước khi refactor sang `src/app/dashboard/admin/...`. **Không code mới vào `src/app/admin`** — đó là code cũ, route hiện hành là `src/app/dashboard/admin`.

---

## 4. Layer 1 — Prisma Schema

`prisma/schema.prisma`:

```prisma
model Post {
  id            String    @id @default(cuid())
  type          PostType  @default(BLOG_POST)
  title         String
  slug          String    @unique
  excerpt       String?
  content       String?
  featuredImage String?
  publishedAt   DateTime?
  isPublished   Boolean   @default(false)
  metaTitle     String?
  metaDesc      String?
  metaKeywords  String?

  /// JSON blob — chỉ dùng cho PROJECT_POST
  projectMeta Json?

  authorId String
  author   User   @relation(fields: [authorId], references: [id])

  categories Category[]
  tags       Tag[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([type, isPublished, publishedAt(sort: Desc)])
  @@index([slug])
  @@index([authorId])
}
```

Nếu cần thêm field mới cho blog (vd: `readingTime`, `viewCount`):
1. Thêm field vào `model Post` trong `schema.prisma`.
2. Chạy migration: `pnpm prisma migrate dev --name <ten_migration_mo_ta>`.
3. Cập nhật `PostWithRelations` + `PostResponse` trong `post.types.ts`.
4. Cập nhật `post.schema.ts` (thêm rule validate nếu cần).
5. Cập nhật `post.service.ts` nếu field ảnh hưởng query (`select`/`include`/`where`).
6. Cập nhật `post.transform.ts` để field xuất hiện trong response.
7. Cập nhật `PostForm.tsx` để user nhập được field mới.

**Không bỏ qua bước nào ở trên** — thiếu 1 layer là field sẽ "biến mất" âm thầm (ví dụ quên transform → API không trả field dù DB đã lưu).

---

## 5. Layer 2 — Validation (Zod)

`src/features/posts/validations/post.schema.ts`

Điểm cần nắm:
- `PostBaseObject` định nghĩa field dùng chung, `PostCreateSchema` và `PostUpdateSchema` đều build từ base này (`.partial()` cho update, giữ `required` với `title`, `slug`, `type`).
- Dùng `.refine()` để validate có điều kiện theo `type` (vd: `PROJECT_POST` bắt buộc có `featuredImage`, `projectMeta.nameOfProject`, `projectMeta.mapEmbedUrl`).
- Input rỗng (`""`, `NaN`) phải `preprocess` về `undefined` trước khi validate optional field (xem `emptyToUndefined`) — nếu không, field optional dạng number/url sẽ bị fail validate âm thầm khi user để trống.
- Slug phải khớp `^[a-z0-9]+(?:-[a-z0-9]+)*$` — dùng `generateSlug()` trong `post.helpers.ts` để tự sinh từ title tiếng Việt (bỏ dấu, thay khoảng trắng bằng `-`).
- Luôn export `type XxxInput = z.infer<typeof XxxSchema>` để service/API dùng type suy ra từ schema, không định nghĩa type tay riêng.
- `PostQuerySchema` validate query string cho GET list (page, size, search, type, showAll, categoryId...) — dùng `z.coerce` để convert string query param sang number/boolean.

Khi thêm rule validate mới cho blog, sửa `PostBaseObject` (áp dụng cả create/update) hoặc chỉ `PostCreateSchema`/`PostUpdateSchema` nếu rule khác nhau giữa tạo mới và cập nhật.

---

## 6. Layer 3 — Service (data access)

`src/features/posts/services/post.service.ts` — luôn có dòng đầu `import "server-only";` để đảm bảo không bị bundle vào client.

Các hàm chuẩn cần có cho một resource CRUD (dùng đúng tên này để nhất quán với các feature khác — `category.service.ts`, `media` service...):

| Hàm | Việc làm |
|---|---|
| `findManyPosts(query)` | List có phân trang, filter, search — trả `{ items, total }` |
| `findPostById(id)` | Lấy 1 bản ghi theo id (dùng cho admin, không filter published) |
| `findPostBySlug(slug)` | Lấy 1 bản ghi theo slug, **chỉ** bản ghi `isPublished: true` (public route) |
| `createPost(data, authorId)` | Insert, kèm `connect` cho relation nhiều-nhiều (categories, tags) |
| `updatePost(id, data)` | Update, dùng `set` cho relation để thay thế toàn bộ danh sách |
| `deletePost(id)` | Xóa cứng (hard delete) |

Quy ước quan trọng:
- Định nghĩa 1 hằng số `POST_INCLUDE` (`satisfies Prisma.PostInclude`) dùng chung cho mọi query cần include relation — tránh lặp lại include ở nhiều hàm.
- Phân biệt rõ **public query** (luôn filter `isPublished: true` + `publishedAt <= now()`) và **admin query** (có cờ `showAll` để bỏ qua filter này). Không để lộ bản nháp (draft) ra route public.
- Dùng `prisma.$transaction([findMany, count])` khi cần trả cả `total` cho phân trang, để đảm bảo 2 query cùng snapshot.
- `Prisma.JsonNull` dùng khi muốn set field Json về NULL thật sự trong DB (khác với bỏ qua field — `undefined` nghĩa là "không update field này").

---

## 7. Layer 4 — Transform (DTO)

`src/features/posts/transforms/post.transform.ts`

Nhiệm vụ duy nhất: **chuyển kết quả Prisma (Date object, quan hệ đầy đủ...) thành JSON-safe response** trả về client:
- `Date` → `.toISOString()`.
- Ẩn field nhạy cảm nếu có (vd không bao giờ trả password hash, token...).
- Cast `projectMeta: unknown` (Prisma Json) về type `ProjectMeta` đã định nghĩa.

Không transform trong route handler hay trong service — luôn qua layer riêng này để response shape nhất quán dù được gọi từ route nào (list, detail, slug).

---

## 8. Layer 5 — API Routes

Next.js App Router route handlers, dùng `NextRequest`/`NextResponse`. Pattern cố định cho mọi route:

```ts
// 1. Nếu cần auth → check session trước tiên, return 401 sớm
const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// 2. Parse + validate input bằng Zod, return 400/422 nếu fail
const parsed = SomeSchema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
}

// 3. Gọi service layer (không query prisma trực tiếp ở đây)
const result = await someService(parsed.data);

// 4. Transform trước khi trả JSON
return NextResponse.json(transformSomething(result));
```

Quy ước status code trong dự án:
- `400` — JSON không parse được / thiếu tham số bắt buộc trên URL.
- `401` — chưa đăng nhập (route admin).
- `404` — không tìm thấy bản ghi (check tồn tại trước khi update/delete).
- `422` — JSON hợp lệ nhưng fail Zod validate.
- `201` — tạo mới thành công.
- `200` — mọi trường hợp thành công khác.

Route file tương ứng:
- `src/app/api/posts/route.ts` → `GET` (list, public + admin qua `showAll`), `POST` (tạo mới, cần auth).
- `src/app/api/posts/[id]/route.ts` → `GET`/`PUT`/`DELETE` theo id (admin, cần auth cho PUT/DELETE; GET theo id dùng nội bộ cho trang edit nên không cần published filter).
- `src/app/api/posts/slug/[slug]/route.ts` → `GET` theo slug, public, **không cần auth** — dùng cho trang chi tiết bài viết ngoài site.

`RouteContext = { params: Promise<{ id: string }> }` — Next.js App Router mới, `params` là Promise, luôn `await params` trước khi dùng.

---

## 9. Layer 6 — Admin Hook (TanStack Query)

`src/hooks/admin/posts/useAdminPosts.ts`

Quy ước bắt buộc cho hook admin (khác với hook public-facing dùng cache bình thường):
- `staleTime: 0, gcTime: 0, refetchOnMount: true` — **admin luôn cần data mới nhất**, không cache, vì admin vừa sửa xong cần thấy ngay.
- `queryKey` bao gồm toàn bộ params ảnh hưởng kết quả (`['admin', 'posts', { search, type, page, size }]`) để mỗi tổ hợp filter có cache riêng, tránh hiển thị nhầm data cũ khi đổi filter.
- `placeholderData: (prev) => prev` — giữ data cũ hiển thị trong lúc fetch data mới (tránh nháy loading liên tục khi gõ search).
- Dùng `apiLogger` (`@/lib/helpers/api-logger`) để log debug/error — không dùng `console.log` trực tiếp.
- Chuẩn hóa response ở cuối hook (hỗ trợ nhiều shape response `{posts, total}` / `{data, pagination}` / `{posts, pageInfo}`) để component tiêu thụ hook không cần quan tâm shape thật của API.

Với route mutate (create/update/delete), pattern hiện tại của dự án **không dùng `useMutation`** — form và nút xóa gọi `fetch()` trực tiếp trong handler rồi `router.push()` + `router.refresh()` (xem `DeletePostButton.tsx`). Giữ nguyên pattern này để nhất quán, trừ khi được yêu cầu refactor sang `useMutation`.

---

## 10. Layer 7 — Admin UI (List / Create / Edit / Delete)

### Danh sách (`(authenticated)/posts/page.tsx`)
- Client component, đọc filter từ URL qua `useSearchParams` (search, type, page) — **không dùng local state cho filter**, để filter có thể share link / back-forward hoạt động đúng.
- Bắt buộc bọc phần dùng `useSearchParams` trong `<Suspense>` (yêu cầu của Next.js App Router).
- Gọi `useAdminPosts(...)` với params lấy từ URL → khi `PostsFilterBar` đổi URL, hook tự refetch.
- Có loading skeleton riêng (không tái dùng skeleton của trang khác).

### Tạo mới (`posts/new/page.tsx`) & Sửa (`posts/[id]/page.tsx`)
- Cả hai đều chỉ là wrapper mỏng render `<PostForm mode="create" />` hoặc `<PostForm mode="edit" post={...} />`.
- Trang `[id]/page.tsx` (server component) fetch post theo id trước khi render form — nếu không tìm thấy, `notFound()`.

### `PostForm.tsx` — form dùng chung create/edit
- `react-hook-form` + `zodResolver(schema)` — `schema` chọn động theo `mode` (`PostCreateSchema` cho create, `PostUpdateSchema` cho edit).
- `defaultValues` build khác nhau theo mode: edit thì map từ `PostResponse` có sẵn (convert `null` → `""` cho input text để tránh React "uncontrolled input" warning), create thì set default tối thiểu (`type: BLOG_POST, isPublished: false, categories: [], tags: []`).
- Field phụ thuộc `type` (categories hợp lệ, hiển thị block `projectMeta`) phải dùng `watch("type")` + lọc lại khi type đổi.
- Dùng `Controller` cho các field không phải input thường (Select, Switch, rich text editor Tiptap, media picker).
- Toast thông báo qua `useAdminToast()` (`src/app/dashboard/admin/_hooks/useAdminToast.ts`), không dùng `alert()`.
- `FIELD_LABELS` map field path → nhãn tiếng Việt, dùng để gom lỗi validate thành thông báo dễ đọc cho user thay vì hiện raw Zod error path.
- Ảnh chọn qua `MediaPicker` / `MediaSelector` (xem [media-management-guide.md](./media-management-guide.md)) — không cho user paste URL ảnh tự do trong flow chính.
- Nội dung bài viết dùng `TiptapEditor` (xem [tiptap-editor-guide.md](./tiptap-editor-guide.md)), không dùng `<textarea>` thô cho `content`.

### `DeletePostButton.tsx`
- Luôn xác nhận qua `AlertDialog` (shadcn/ui) trước khi gọi API xóa — không xóa ngay khi click.
- Sau khi xóa: `router.push(...)` về danh sách rồi `router.refresh()` để list server component (nếu có) re-fetch.

### `PostsFilterBar.tsx`
- Đổi filter = đổi query string trên URL (`router.push` với `URLSearchParams` mới), không giữ state filter riêng trong component.

---

## 11. Auth & phân quyền

- Không có `middleware.ts` bảo vệ theo path pattern — bảo vệ được làm ở 2 lớp:
  1. **UI**: `src/app/dashboard/admin/(authenticated)/layout.tsx` — server component, gọi `auth()`, `redirect("/auth/login")` nếu chưa có session. Mọi page trong route group `(authenticated)` tự động được bọc layout này.
  2. **API**: mỗi route handler cần bảo vệ (POST/PUT/DELETE) tự gọi `await auth()` và check `session?.user?.id` ở đầu hàm, return `401` nếu không có.
- GET list/detail/slug **không yêu cầu auth** vì phục vụ cả trang public — bảo mật nằm ở filter `isPublished`/`showAll`, không phải ở auth.
- Hiện tại chưa phân role admin/editor — mọi user đăng nhập được coi là có quyền quản trị. Nếu task yêu cầu phân quyền chi tiết hơn, cần hỏi lại user trước khi tự thiết kế role system mới.

---

## 12. Checklist: build một CRUD mới theo mẫu này

Dùng khi cần build CRUD cho resource khác (không phải Post) theo đúng kiến trúc dự án, ví dụ "quản lý Testimonial", "quản lý FAQ":

- [ ] Thêm `model` vào `prisma/schema.prisma`, chạy `pnpm prisma migrate dev --name <ten>`.
- [ ] Tạo `src/features/<resource>/types/<resource>.types.ts` — Response DTO + type quan hệ Prisma.
- [ ] Tạo `src/features/<resource>/validations/<resource>.schema.ts` — `CreateSchema`, `UpdateSchema` (build từ base object dùng `.partial()`), `QuerySchema` cho list params.
- [ ] Tạo `src/features/<resource>/services/<resource>.service.ts` — `import "server-only"` + các hàm `findMany/findById/create/update/delete`.
- [ ] Tạo `src/features/<resource>/transforms/<resource>.transform.ts` — map Prisma model → Response DTO.
- [ ] Tạo API routes: `src/app/api/<resource>/route.ts` (GET list, POST create) + `src/app/api/<resource>/[id]/route.ts` (GET/PUT/DELETE).
- [ ] Nếu cần trang admin: tạo hook `src/hooks/admin/<resource>/useAdmin<Resource>.ts` (staleTime:0, gcTime:0).
- [ ] Tạo trang admin trong `src/app/dashboard/admin/(authenticated)/<resource>/` (`page.tsx`, `new/page.tsx`, `[id]/page.tsx`) + component `_components/<Resource>Form.tsx`, `Delete<Resource>Button.tsx`.
- [ ] Thêm link vào `AdminSidebar` (`src/app/dashboard/admin/_components/AdminSidebar.tsx`) để trang mới có trong menu điều hướng.
- [ ] Kiểm tra: build không lỗi type (`pnpm build` hoặc `tsc --noEmit`), test luồng tạo/sửa/xóa trên trình duyệt thật trước khi báo hoàn thành.

---

## 13. Lỗi thường gặp / lưu ý

- **Quên `await params`** trong route handler App Router mới → lỗi type hoặc `params` là Promise chưa resolve. Luôn `const { id } = await params;`.
- **Field optional bị fail validate khi để trống** — do quên `preprocess(emptyToUndefined, ...)` cho field number/url optional trong Zod schema.
- **Update route xóa mất relation không mong muốn** — nhớ dùng `...(categories !== undefined && { categories: { set: ... } })`: chỉ update relation khi field thực sự có mặt trong payload, tránh vô tình xóa hết categories khi client chỉ gửi field khác.
- **Lộ bài viết chưa publish ra route public** — luôn double-check `findPostBySlug`/`findManyPosts` (khi `showAll` falsy) filter đúng `isPublished: true` và `publishedAt <= now()`.
- **Sửa nhầm code trong `src/app/admin/`** thay vì `src/app/dashboard/admin/` — thư mục `src/app/admin` là tàn dư cũ, route hiện hành là `dashboard/admin`.
- **`projectMeta` chỉ có ý nghĩa với `PROJECT_POST`** — khi build feature chung cho "Post", đừng quên các bài `BLOG_POST` sẽ có `projectMeta: null`, không được giả định field này luôn tồn tại.
- **Slug trùng** — DB có `@unique` trên `slug`, nhưng nên validate/check trùng ở service trước khi insert để trả lỗi 422 rõ ràng thay vì để Prisma throw lỗi constraint (500).

---

**Tài liệu liên quan:**
- [media-management-guide.md](./media-management-guide.md) — chi tiết upload/chọn ảnh (Cloudinary + MediaPicker/MediaSelector).
- [tiptap-editor-guide.md](./tiptap-editor-guide.md) — chi tiết rich text editor dùng cho field `content`.
- [../refactor-cms/](../refactor-cms/) — lịch sử quyết định kỹ thuật khi refactor từ WordPress sang stack hiện tại (Next.js + Prisma + PostgreSQL).
