# 06 — Cleanup

## Packages cần xóa

```bash
pnpm remove @upstash/redis ws bufferutil
```

## Packages cần thêm

```bash
# Core
pnpm add prisma @prisma/client
pnpm add next-auth@beta
pnpm add bcryptjs
pnpm add server-only

# TanStack Query
pnpm add @tanstack/react-query @tanstack/react-query-devtools

# Rich Text Editor
pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder

# Dev
pnpm add -D @types/bcryptjs
```

> `react-hook-form`, `@hookform/resolvers`, `zod`, `sonner`, `lucide-react`, `shadcn/ui` — **đã có sẵn**, không cần cài thêm.

---

## Files cần xóa

| File | Lý do |
|---|---|
| `src/lib/redis.ts` | Không còn dùng Redis / JWT WP token |
| `src/lib/api.ts` | Toàn bộ GraphQL queries đến WordPress |
| `src/data/datafromWP.ts` | Data layer cũ |
| `src/types/typeForWordpressData.ts` | Types từ WP schema |
| `src/app/api/refresh-token/` | Cron refresh JWT WP |
| `docs/CRON_JOB_AUTO_REFRESH_TOKEN.md` | Không còn liên quan |

---

## Environment Variables

### `.env.local` (development)
```env
# Xóa
NEXT_PUBLIC_WORDPRESS_API_URL=
WORDPRESS_AUTH_REFRESH_TOKEN=
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Thêm
DATABASE_URL="postgresql://user:password@host:5432/idoarchitects?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/idoarchitects?sslmode=require"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Vercel Production
```env
DATABASE_URL=           # Neon DB pooled connection
DIRECT_URL=             # Neon DB direct connection (dùng cho migrate)
NEXTAUTH_SECRET=
NEXTAUTH_URL=           # https://idoarchitects.vn
NEXT_PUBLIC_APP_URL=    # https://idoarchitects.vn
```

---

## `next.config.mjs` — cập nhật domain ảnh

```javascript
// Xóa domain WordPress cũ, thêm domain mới
const nextConfig = {
  images: {
    remotePatterns: [
      // Giữ tạm nếu vẫn còn link ảnh WP cũ
      {
        protocol: "https",
        hostname: "your-old-wordpress-domain.com",
      },
      // Thêm domain ảnh mới (Cloudinary hoặc UploadThing)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};
```

---

## `src/app/layout.tsx` — thêm QueryProvider

```typescript
import { QueryProvider } from "@/providers/QueryProvider";
// ...

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

---

## Cập nhật `sitemap.ts`

```typescript
// src/app/sitemap.ts
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // Gọi qua API route (không gọi Prisma trực tiếp)
  const [postsRes, portfoliosRes] = await Promise.all([
    fetch(`${baseUrl}/api/posts?size=1000`).then((r) => r.json()),
    fetch(`${baseUrl}/api/portfolios`).then((r) => r.json()),
  ]);

  const postUrls = postsRes.posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  const portfolioUrls = portfoliosRes.portfoliosArray.map((p: any) => ({
    url: `${baseUrl}/du-an/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/du-an`, lastModified: new Date() },
    { url: `${baseUrl}/cac-dich-vu`, lastModified: new Date() },
    { url: `${baseUrl}/gioi-thieu`, lastModified: new Date() },
    { url: `${baseUrl}/lien-he`, lastModified: new Date() },
    ...postUrls,
    ...portfolioUrls,
  ];
}
```
