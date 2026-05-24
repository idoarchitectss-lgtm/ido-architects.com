# 01 — Tổng quan & Phân tích hiện trạng

## 1. Lý do refactor

Website hiện tại đang dùng **WordPress** làm Headless CMS, giao tiếp qua **GraphQL API** với JWT Authentication và Redis để lưu refresh token. Điều này dẫn đến:

- Phụ thuộc vào WordPress server riêng biệt (chi phí hosting, bảo trì)
- Phức tạp khi deploy (cần refresh token tự động, Redis trên Upstash)
- Khó mở rộng tính năng CMS theo yêu cầu riêng
- Build timeout trên Vercel do fetch GraphQL chậm (đã có `VERCEL_BUILD_TIMEOUT_ANALYSIS.md`)

## 2. Phân tích hiện trạng

### Files cần thay thế

| File hiện tại | Vai trò | Thay bằng |
|---|---|---|
| `src/lib/api.ts` | Tất cả GraphQL queries đến WP | Prisma Client queries |
| `src/lib/redis.ts` | Lưu JWT WP token | Xóa |
| `src/data/datafromWP.ts` | Data fetching helpers | `src/data/datafromDB.ts` |
| `src/types/typeForWordpressData.ts` | Types từ WP schema | Prisma generated types |
| `src/app/api/refresh-token/` | Cron refresh JWT WP | Xóa |
| `docs/CRON_JOB_AUTO_REFRESH_TOKEN.md` | Hướng dẫn cron WP token | Không còn cần |

### Custom Post Types hiện tại trên WordPress

```
portfolios          → du-an, du-an-noi-bat, du-an-da-hoan-thien
posts               → blog
services            → cac-dich-vu
heros               → homepage hero section
abouts              → gioi-thieu
pages               → tuyen-dung (dùng getDetailPage)
portfolioCategories → filter du-an
```

### Routes hiện tại (giữ nguyên slug)

```
/                           → homepage
/blog                       → danh sách bài viết
/blog/[slug]                → chi tiết bài viết
/du-an                      → tất cả portfolio
/du-an/[slug]               → chi tiết portfolio
/du-an-noi-bat              → portfolio isFeatured=true
/du-an-da-hoan-thien        → portfolio isCompleted=true
/cac-dich-vu                → danh sách dịch vụ
/cac-dich-vu/[slug]         → chi tiết dịch vụ
/gioi-thieu                 → trang giới thiệu
/lien-he                    → trang liên hệ
/tuyen-dung                 → trang tuyển dụng
```

## 3. Stack mới

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) — đã có |
| Database | PostgreSQL (Neon DB — serverless, free tier) |
| ORM | Prisma |
| Authentication (Admin) | NextAuth.js v5 với Credentials provider |
| Rich Text Editor | TipTap |
| Form | React Hook Form — đã có (`@hookform/resolvers`) |
| Validation | Zod — đã có |
| UI Components | shadcn/ui — đã có |
| Image Upload | blob vercel |
| Toast | Sonner — đã có |

## 4. Quyết định quan trọng

### ✅ Không migrate data từ WordPress
- Nhập tay bài viết mới qua CMS Admin Panel
- WordPress vẫn giữ online trong giai đoạn chuyển đổi
- Có thể dùng tạm link ảnh từ WP, sau đó upload lại dần

### ✅ Giữ nguyên URL slug
- Không đổi cấu trúc route để bảo toàn SEO
- Slug trong database phải match với slug cũ trên WP nếu muốn giữ page đó

### ✅ Dùng Neon DB (PostgreSQL serverless)
- Free tier phù hợp với scale hiện tại
- Tích hợp tốt với Vercel
- `@neondatabase/serverless` đã có trong `package.json`

## 5. Environment Variables cần thay đổi

### Xóa
```env
NEXT_PUBLIC_WORDPRESS_API_URL=
WORDPRESS_AUTH_REFRESH_TOKEN=
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

### Thêm
```env
DATABASE_URL="postgresql://..."           # Neon DB connection string
NEXTAUTH_SECRET="random-secret-string"   # NextAuth secret
NEXTAUTH_URL="https://yourdomain.com"    # URL production
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""     # Nếu dùng Cloudinary
```
