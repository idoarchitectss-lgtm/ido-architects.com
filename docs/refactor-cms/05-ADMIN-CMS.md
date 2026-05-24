# 05 — Admin CMS Panel

## Cấu trúc thư mục

```
src/app/admin/
├── layout.tsx                    # Protected layout — kiểm tra session
├── page.tsx                      # Dashboard
├── login/
│   └── page.tsx                  # Trang đăng nhập
└── posts/
    ├── page.tsx                  # Danh sách tất cả bài viết (filter theo type)
    ├── new/
    │   └── page.tsx              # Tạo bài viết mới (chọn type: Blog / Project)
    └── [id]/
        └── page.tsx              # Chỉnh sửa bài viết
```

> **Không có admin pages cho portfolios / services / hero / about** — các nội dung đó dùng static data files (`src/data/static/*.ts`), chỉnh sửa trực tiếp qua code.

---

## 1. Authentication — NextAuth.js v5

### Cài đặt
```bash
pnpm add next-auth@beta
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
```

### Config `src/lib/auth.ts`
```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas/admin";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const validated = LoginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});
```

### Route handler `src/app/api/admin/auth/[...nextauth]/route.ts`
```typescript
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
```

### Middleware bảo vệ `/admin`
```typescript
// src/middleware.ts
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isLoggedIn = !!req.auth;

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return Response.redirect(new URL("/admin/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
```

---

## 2. Zod Schemas cho Admin Forms

Thêm vào `src/schemas/index.ts`:

```typescript
// src/schemas/admin.ts
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu ít nhất 6 ký tự" }),
});

export const PostSchema = z.object({
  type: z.enum(["BLOG_POST", "PROJECT_POST"]).default("BLOG_POST"),
  title: z.string().min(3, { message: "Tiêu đề ít nhất 3 ký tự" }).max(200),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug chỉ gồm chữ thường, số và dấu gạch ngang",
    }),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, { message: "Nội dung không được để trống" }),
  featuredImage: z.string().url({ message: "URL ảnh không hợp lệ" }).optional(),
  isPublished: z.boolean().default(false),
  metaTitle: z.string().max(60).optional(),
  metaDesc: z.string().max(160).optional(),
  metaKeywords: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  // Chỉ validate khi type = PROJECT_POST
  projectMeta: z.object({
    nameOfProject: z.string().optional(),
    addressOfProperty: z.string().optional(),
    completedYear: z.string().optional(),
    floorDimension: z.coerce.number().positive().optional(),
    numberOfFloors: z.coerce.number().int().positive().optional(),
    propertyType: z.string().optional(),
    designedCompany: z.string().optional(),
    isCompleted: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
  }).optional(),
}).refine(
  (data) => data.type !== "PROJECT_POST" || !!data.featuredImage,
  { message: "Bài viết dự án cần có ảnh đại diện", path: ["featuredImage"] }
);

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type PostFormValues = z.infer<typeof PostSchema>;
```

---

## 3. Form với React Hook Form + shadcn/ui

> ⚡ **Admin CMS dùng TanStack Query hooks** từ `src/features/[domain]/hooks/` để fetch/mutate data — xem chi tiết hooks tại [04-DATA-LAYER.md](./04-DATA-LAYER.md#layer-7--hooks-featurepostshooksusepostts)

### Ví dụ: Form tạo bài viết (`PostForm`)

> Đã có sẵn: `react-hook-form`, `@hookform/resolvers`, `zod`, shadcn/ui components (`form.tsx`, `input.tsx`, `textarea.tsx`, `button.tsx`, `select.tsx`, `switch.tsx`)

```typescript
// src/components/admin/PostForm.tsx
"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema, type PostFormValues } from "@/schemas/admin";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PostFormProps {
  defaultValues?: Partial<PostFormValues>;
  postId?: string; // nếu có = edit mode
}

export function PostForm({ defaultValues, postId }: PostFormProps) {
  const router = useRouter();
  const form = useForm<PostFormValues>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      type: "BLOG_POST",
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      isPublished: false,
      ...defaultValues,
    },
  });

  // Watch type để hiển thị conditional fields
  const postType = useWatch({ control: form.control, name: "type" });

  async function onSubmit(values: PostFormValues) {
    const url = postId ? `/api/posts/${postId}` : "/api/posts";
    const method = postId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
      return;
    }

    toast.success(postId ? "Cập nhật thành công!" : "Tạo bài viết thành công!");
    router.push("/admin/posts");
    router.refresh();
  }

  function handleTitleChange(value: string) {
    form.setValue("title", value);
    if (!postId) {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Post Type Selector */}
        <FormField control={form.control} name="type" render={({ field }) => (
          <FormItem>
            <FormLabel>Loại bài viết</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại bài viết" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="BLOG_POST">Bài viết Blog</SelectItem>
                <SelectItem value="PROJECT_POST">Dự án</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {/* Title */}
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Tiêu đề</FormLabel>
            <FormControl>
              <Input
                placeholder="Nhập tiêu đề bài viết..."
                {...field}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Slug */}
        <FormField control={form.control} name="slug" render={({ field }) => (
          <FormItem>
            <FormLabel>Slug (URL)</FormLabel>
            <FormControl>
              <Input placeholder="ten-bai-viet" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Excerpt */}
        <FormField control={form.control} name="excerpt" render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả ngắn</FormLabel>
            <FormControl>
              <Textarea rows={3} placeholder="Mô tả ngắn..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Content — TipTap Editor */}
        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem>
            <FormLabel>Nội dung</FormLabel>
            <FormControl>
              {/* Thay bằng <TipTapEditor /> */}
              <Textarea rows={15} placeholder="Nội dung bài viết..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* ── PROJECT META — chỉ hiển thị khi type = PROJECT_POST ── */}
        {postType === "PROJECT_POST" && (
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <h3 className="font-semibold text-sm">Thông tin dự án</h3>

            <FormField control={form.control} name="projectMeta.nameOfProject" render={({ field }) => (
              <FormItem>
                <FormLabel>Tên dự án</FormLabel>
                <FormControl><Input placeholder="Biệt thự Vinhomes..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="projectMeta.addressOfProperty" render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl><Input placeholder="123 Nguyễn Huệ, Q.1, TP.HCM" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="projectMeta.completedYear" render={({ field }) => (
                <FormItem>
                  <FormLabel>Năm hoàn thành</FormLabel>
                  <FormControl><Input placeholder="2024" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="projectMeta.floorDimension" render={({ field }) => (
                <FormItem>
                  <FormLabel>Diện tích (m²)</FormLabel>
                  <FormControl><Input type="number" placeholder="500" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="projectMeta.numberOfFloors" render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tầng</FormLabel>
                  <FormControl><Input type="number" placeholder="3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="projectMeta.propertyType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại công trình</FormLabel>
                  <FormControl><Input placeholder="Biệt thự / Nhà phố..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="flex gap-8">
              <FormField control={form.control} name="projectMeta.isFeatured" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel>Dự án nổi bật</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="projectMeta.isCompleted" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel>Đã hoàn thành</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </div>
        )}

        {/* Publish toggle */}
        <FormField control={form.control} name="isPublished" render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormLabel>Xuất bản</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )} />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang lưu..." : postId ? "Cập nhật" : "Tạo bài viết"}
        </Button>
      </form>
    </Form>
  );
}
```

---

## 4. TipTap Rich Text Editor

### Cài đặt
```bash
pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder
```

### Component `src/components/admin/TipTapEditor.tsx`
```typescript
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TipTapEditor({ value, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="border rounded-md min-h-[400px] p-3">
      {/* Toolbar */}
      <div className="flex gap-2 border-b pb-2 mb-3">
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive("bold") ? "font-bold underline" : ""}>B</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>List</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
```

---

## 5. Protected Admin Layout

```typescript
// src/app/admin/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-lg font-bold mb-6">IDO Admin</h2>
        <nav className="space-y-2">
          <a href="/admin/posts" className="block p-2 hover:bg-gray-700 rounded">Tất cả bài viết</a>
          <a href="/admin/posts?type=BLOG_POST" className="block p-2 hover:bg-gray-700 rounded pl-6 text-sm">↳ Blog</a>
          <a href="/admin/posts?type=PROJECT_POST" className="block p-2 hover:bg-gray-700 rounded pl-6 text-sm">↳ Dự án</a>
          <a href="/admin/posts/new" className="block p-2 hover:bg-gray-700 rounded text-green-400">+ Tạo mới</a>
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
```
