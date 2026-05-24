# 02 — Prisma Schema (PostgreSQL)

## Quyết định thiết kế

> ✅ **1 bảng `Post` duy nhất** cho cả blog và dự án (portfolio).  
> Phân biệt bằng enum `PostType`:  `BLOG_POST` | `PROJECT_POST`
>
> ✅ **Services, Hero, About, các section tĩnh** → dùng **static component** (hardcode hoặc file `.ts` config), **không cần CMS**.

**Lý do:**
- Ít bảng → schema đơn giản, dễ maintain
- Blog post và project post có cùng cấu trúc cốt lõi (title, slug, content, image, SEO)
- Project post có thêm các trường riêng (generalInfo) → dùng cột JSON `metadata`
- Services/Hero/About thay đổi rất ít → không cần overhead của CMS

---

## Cài đặt

```bash
pnpm add prisma @prisma/client
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
npx prisma init
```

## File `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  // Neon DB dùng connection pooling:
  directUrl = env("DIRECT_URL")
}

// ─────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // bcrypt hash
  role      Role     @default(EDITOR)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  EDITOR
}

// ─────────────────────────────────────────
// POST (Blog + Project dùng chung 1 bảng)
// ─────────────────────────────────────────

enum PostType {
  BLOG_POST
  PROJECT_POST
}

model Post {
  id            String     @id @default(cuid())
  type          PostType   @default(BLOG_POST)  // phân loại
  title         String
  slug          String     @unique
  excerpt       String?
  content       String?    // HTML từ TipTap editor
  featuredImage String?    // URL ảnh
  publishedAt   DateTime?
  isPublished   Boolean    @default(false)

  // SEO
  metaTitle     String?
  metaDesc      String?
  metaKeywords  String?

  // Chỉ dùng khi type = PROJECT_POST
  // Lưu dạng JSON: { nameOfProject, addressOfProperty, completedYear,
  //                  floorDimension, numberOfFloors, propertyType,
  //                  designedCompany, isCompleted, isFeatured }
  projectMeta   Json?

  author        User       @relation(fields: [authorId], references: [id])
  authorId      String
  categories    Category[]
  tags          Tag[]

  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  // Index để filter nhanh theo type
  @@index([type, isPublished, publishedAt(sort: Desc)])
}

model Category {
  id    String @id @default(cuid())
  name  String
  slug  String @unique
  // Một category có thể dùng cho cả blog lẫn project
  // Filter theo type khi query nếu cần
  posts Post[]
}

model Tag {
  id    String @id @default(cuid())
  name  String
  slug  String @unique
  posts Post[]
}
```

---

## Cấu trúc `projectMeta` (Json field)

Khi `type = PROJECT_POST`, field `projectMeta` chứa:

```typescript
// src/features/posts/types/post.types.ts
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
```

> **Tại sao dùng `Json?` thay vì nhiều cột riêng?**
> - Project meta chỉ dùng khi `type = PROJECT_POST`, nếu tách cột thì blog post sẽ có nhiều cột `null` không cần thiết
> - Dễ mở rộng thêm trường mới mà không cần migrate schema
> - Query filter `isFeatured`, `isCompleted` vẫn được nếu cần (Prisma hỗ trợ `path` filter trên Json)

---

## Static content — KHÔNG cần CMS

Các phần sau hardcode trực tiếp trong code, **không có bảng DB**:

```
src/data/static/
├── services.ts      # Danh sách dịch vụ
├── hero.ts          # Hero banner content
├── about.ts         # Giới thiệu công ty
├── values.ts        # Giá trị cốt lõi
└── contact.ts       # Thông tin liên hệ
```

Ví dụ `src/data/static/services.ts`:
```typescript
export const SERVICES = [
  {
    slug: "thiet-ke-kien-truc",
    title: "Thiết kế kiến trúc",
    excerpt: "...",
    featuredImage: "/image/our-service.webp",
    description: "...",
  },
  // ...
] as const;
```

Khi cần cập nhật → sửa file `.ts` rồi deploy lại. Không cần UI CMS vì các nội dung này hiếm khi thay đổi.

---

## Prisma Client singleton

Tạo file `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

## Seed file — tạo admin đầu tiên

Tạo file `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@idoarchitects.vn" },
    update: {},
    create: {
      email: "admin@idoarchitects.vn",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Seed categories mẫu
  const blogCats = ["Tin tức", "Cảm hứng thiết kế", "Mẹo & Kinh nghiệm"];
  const projectCats = ["Nhà phố", "Biệt thự", "Nội thất", "Thương mại"];

  for (const name of [...blogCats, ...projectCats]) {
    await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) },
    });
  }

  console.log("✅ Seed xong");
}

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

Thêm vào `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

## Các lệnh thường dùng

```bash
# Tạo migration đầu tiên
npx prisma migrate dev --name init

# Chạy seed
npx prisma db seed

# Mở Prisma Studio (xem data)
npx prisma studio

# Generate Prisma Client sau khi sửa schema
npx prisma generate
```
