# 📚 Tài liệu Refactor CMS — WordPress → Next.js Full-Stack

## Mục lục

| File | Nội dung |
|---|---|
| [01-OVERVIEW.md](./01-OVERVIEW.md) | Tổng quan, phân tích hiện trạng, quyết định kỹ thuật |
| [02-PRISMA-SCHEMA.md](./02-PRISMA-SCHEMA.md) | Thiết kế database schema với Prisma + PostgreSQL |
| [03-API-ROUTES.md](./03-API-ROUTES.md) | Thiết kế API Routes thay thế GraphQL WordPress |
| [04-DATA-LAYER.md](./04-DATA-LAYER.md) | Refactor data layer (`datafromWP.ts` → `datafromDB.ts`) |
| [05-ADMIN-CMS.md](./05-ADMIN-CMS.md) | Admin CMS Panel: Auth, Forms, shadcn/ui, Zod |
| [06-CLEANUP.md](./06-CLEANUP.md) | Cleanup dependencies, env vars, types cũ |
| [07-TIMELINE.md](./07-TIMELINE.md) | Timeline & checklist thực hiện |

---

## Tóm tắt nhanh

- **Stack cũ**: WordPress GraphQL API + Redis JWT token
- **Stack mới**: Next.js API Routes + PostgreSQL + Prisma ORM
- **CMS Admin**: `/admin` route, NextAuth.js, shadcn/ui forms, Zod validation
- **Không migrate data**: Nhập tay bài viết qua CMS mới
- **Giữ nguyên slug** để không ảnh hưởng SEO

> Branch đang làm việc: `feature/refactor-cms`
