# Hướng dẫn sử dụng TiptapEditor trong LemsTech

> **Phiên bản tài liệu:** 1.0  
> **Cập nhật lần cuối:** 2026-05-23  
> **Áp dụng cho:** Tất cả các form có trường nội dung bài viết (blog post, sản phẩm, AI tool, v.v.)

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Cài đặt packages](#2-cài-đặt-packages)
3. [Cấu trúc file](#3-cấu-trúc-file)
4. [Props API](#4-props-api)
5. [Tích hợp với React Hook Form](#5-tích-hợp-với-react-hook-form)
6. [Tích hợp qua Context Provider](#6-tích-hợp-qua-context-provider)
7. [Tính năng Toolbar](#7-tính-năng-toolbar)
8. [Chèn ảnh từ Media Library](#8-chèn-ảnh-từ-media-library)
9. [Chế độ Fullscreen](#9-chế-độ-fullscreen)
10. [Tùy chỉnh CSS](#10-tùy-chỉnh-css)
11. [Lưu và khôi phục nội dung](#11-lưu-và-khôi-phục-nội-dung)
12. [Hiển thị nội dung HTML ra ngoài editor](#12-hiển-thị-nội-dung-html-ra-ngoài-editor)
13. [Các lưu ý quan trọng](#13-các-lưu-ý-quan-trọng)

---

## 1. Tổng quan

`TiptapEditor` là trình soạn thảo văn bản giàu định dạng (rich-text editor) được xây dựng trên nền tảng [Tiptap v2](https://tiptap.dev), tích hợp sẵn vào hệ thống LemsTech.

**Đầu vào / Đầu ra:**
- Nhận vào: `string` (HTML)
- Trả ra: `string` (HTML) thông qua callback `onChange`

**Các extension đã cài:**

| Extension | Package | Mục đích |
|---|---|---|
| `StarterKit` | `@tiptap/starter-kit` | Bold, Italic, Strike, Code, Heading, List, Blockquote, CodeBlock, Undo/Redo |
| `Underline` | `@tiptap/extension-underline` | Gạch chân văn bản |
| `Link` | `@tiptap/extension-link` | Chèn và quản lý hyperlink |
| `Image` | `@tiptap/extension-image` | Chèn ảnh từ Media Library |
| `TextAlign` | `@tiptap/extension-text-align` | Căn chỉnh văn bản (trái/giữa/phải/đều) |

---

## 2. Cài đặt packages

Các package đã được cài sẵn trong dự án. Nếu cần cài lại:

```bash
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-link @tiptap/extension-image @tiptap/extension-text-align
```

---

## 3. Cấu trúc file

```
components/custom/tiptap/
├── tiptap-editor.tsx          # Component chính
└── tiptap-editor-styles.css   # CSS tùy chỉnh cho ProseMirror
```

CSS styles được import toàn cục trong admin layout:

```tsx
// app/dashboard/admin/layout.tsx
import "../../../components/custom/tiptap/tiptap-editor-styles.css"
```

> ⚠️ **Lưu ý:** Nếu dùng `TiptapEditor` ngoài dashboard admin, cần import CSS vào layout tương ứng.

---

## 4. Props API

```tsx
interface TiptapEditorProps {
  content?: string       // HTML string — nội dung khởi tạo
  onChange?: (content: string) => void  // Callback khi nội dung thay đổi
  placeholder?: string   // Placeholder text khi editor rỗng
  className?: string     // Class CSS cho wrapper bên ngoài (chỉ áp dụng khi KHÔNG fullscreen)
}
```

**Ví dụ cơ bản:**

```tsx
import TiptapEditor from "@/components/custom/tiptap/tiptap-editor"

<TiptapEditor
  content="<p>Nội dung ban đầu</p>"
  onChange={(html) => console.log(html)}
  placeholder="Bắt đầu viết..."
  className="min-h-[300px]"
/>
```

---

## 5. Tích hợp với React Hook Form

Đây là pattern chuẩn để dùng `TiptapEditor` bên trong một form sử dụng `react-hook-form` + Zod.

### Bước 1 — Định nghĩa schema Zod

```ts
// validation/post.schema.ts
import { z } from "zod"

export const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  content: z.string().min(10, "Nội dung quá ngắn"),
})

export type PostFormValues = z.infer<typeof postSchema>
```

### Bước 2 — Tích hợp vào FormField

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import TiptapEditor from "@/components/custom/tiptap/tiptap-editor"
import { postSchema, type PostFormValues } from "@/validation/post.schema"

export function PostForm() {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  const onSubmit = (values: PostFormValues) => {
    console.log(values.content) // HTML string
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ... các field khác ... */}

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung bài viết</FormLabel>
              <FormControl>
                <TiptapEditor
                  content={field.value}
                  onChange={(html) => field.onChange(html)}
                  placeholder="Viết nội dung bài viết ở đây..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

> ✅ **Giải thích:** `field.value` truyền HTML hiện tại vào editor; `field.onChange(html)` cập nhật giá trị trong form mỗi khi người dùng chỉnh sửa. `FormMessage` tự động hiển thị lỗi Zod.

---

## 6. Tích hợp qua Context Provider

Khi form phức tạp, được chia thành nhiều tab/component con (ví dụ: `ProductContentTab`), dữ liệu được quản lý qua Context để tránh prop drilling.

### Pattern đang dùng trong `ProductContentTab`

```tsx
// components/custom/products/ProductContentTab.tsx
"use client"

import TiptapEditor from "@/components/custom/tiptap/tiptap-editor"
import { useProductForm } from "@/components/providers/product-form-context"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

export const ProductContentTab = () => {
  const { form, handleContentChange } = useProductForm()

  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nội dung sản phẩm</FormLabel>
          <FormControl>
            <TiptapEditor
              content={field.value}
              onChange={handleContentChange}  // ← hàm từ context
              placeholder="Viết mô tả chi tiết sản phẩm ở đây..."
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
```

### Khai báo handler trong Context

```tsx
// components/providers/product-form-context.tsx (ví dụ minh họa)
const handleContentChange = useCallback((html: string) => {
  form.setValue("content", html, { shouldValidate: true, shouldDirty: true })
}, [form])
```

> 💡 **Tip:** Dùng `shouldValidate: true` để Zod validate ngay khi người dùng nhập, hiển thị lỗi real-time.

---

## 7. Tính năng Toolbar

Toolbar được chia thành các nhóm:

| Nhóm | Nút | Phím tắt |
|---|---|---|
| **Định dạng văn bản** | Bold, Italic, Underline, Strike, Inline Code | Ctrl+B, Ctrl+I, Ctrl+U |
| **Tiêu đề** | Paragraph, H1, H2, H3 | — |
| **Căn chỉnh** | Trái, Giữa, Phải, Đều | — |
| **Danh sách** | Bullet List, Numbered List, Blockquote, Code Block | — |
| **Liên kết & Ảnh** | Chèn link, Chèn ảnh từ thư viện, Xóa link | — |
| **Tiện ích** | Clear formatting, Undo, Redo | Ctrl+Z, Ctrl+Y |
| **Màn hình** | Toggle Fullscreen | ESC để thoát |

---

## 8. Chèn ảnh từ Media Library

Editor tích hợp sẵn `MediaSelector` — cho phép chọn ảnh từ thư viện media của hệ thống thay vì nhập URL thủ công.

**Cách hoạt động:**
1. Nhấn nút 📷 trên toolbar
2. Dialog `MediaSelector` mở ra
3. Chọn 1 ảnh → ảnh được chèn vào vị trí con trỏ

```tsx
// Logic xử lý trong tiptap-editor.tsx
const handleMediaSelect = (items: MediaItem[]) => {
  if (items && items[0]) {
    editor?.chain().focus().setImage({
      src: items[0].url,
      alt: items[0].altText || items[0].filename || "",
    }).run()
  }
  setIsImageDialogOpen(false)
}
```

Ảnh được render với class `max-w-full h-auto rounded-lg` (cấu hình trong extension `Image`).

---

## 9. Chế độ Fullscreen

Editor hỗ trợ chế độ toàn màn hình để tập trung viết bài.

- **Mở:** Nhấn nút ⬜ (Expand) ở góc phải toolbar
- **Đóng:** Nhấn nút thu nhỏ hoặc nhấn phím `ESC`

**Khi fullscreen:**
- Editor chiếm 90% chiều cao × 90% chiều rộng màn hình
- Có backdrop mờ phía sau (`bg-black/50`)
- Font-size tăng lên `18px`, line-height `1.8`
- `document.body.style.overflow = 'hidden'` để ngăn scroll trang

---

## 10. Tùy chỉnh CSS

File CSS: `components/custom/tiptap/tiptap-editor-styles.css`

Tất cả style đều scope vào class `.tiptap-editor-content .ProseMirror` để không ảnh hưởng đến phần render nội dung ngoài editor.

**Các class quan trọng:**

```css
/* Editor wrapper */
.tiptap-editor-content .ProseMirror { ... }

/* Fullscreen mode */
.tiptap-editor-fullscreen .ProseMirror { ... }

/* Các element */
.tiptap-editor-content .ProseMirror h1 { ... }
.tiptap-editor-content .ProseMirror h2 { ... }
.tiptap-editor-content .ProseMirror h3 { ... }
.tiptap-editor-content .ProseMirror blockquote { ... }
.tiptap-editor-content .ProseMirror pre { ... }     /* Code block */
.tiptap-editor-content .ProseMirror code { ... }    /* Inline code */
.tiptap-editor-content .ProseMirror img { ... }
```

**Thêm style tùy chỉnh:** Chỉnh sửa trực tiếp file CSS trên, không cần tạo file mới.

---

## 11. Lưu và khôi phục nội dung

### Lưu lên database

Editor trả về HTML string qua `onChange`. Lưu trực tiếp chuỗi HTML này vào database (cột kiểu `TEXT`).

```ts
// Prisma schema
model Post {
  id      String @id @default(cuid())
  title   String
  content String @db.Text  // Lưu HTML string
}
```

### Khôi phục nội dung khi edit

Truyền HTML đã lưu vào prop `content`:

```tsx
// Khi load form edit
const post = await getPostById(id)

<TiptapEditor
  content={post.content}  // HTML string từ database
  onChange={(html) => form.setValue("content", html)}
/>
```

### Sync content khi prop thay đổi

Editor có `useEffect` tự động sync khi `content` prop thay đổi từ bên ngoài (ví dụ: khi chuyển đổi giữa bản nháp và bản đã lưu):

```tsx
useEffect(() => {
  if (editor && content !== undefined && editor.getHTML() !== content) {
    editor.commands.setContent(content, false) // false = không emit update
  }
}, [editor, content])
```

---

## 12. Hiển thị nội dung HTML ra ngoài editor

Khi hiển thị bài viết ra phía frontend (không dùng editor), render HTML string với class `prose` của Tailwind Typography:

```tsx
// components/blog/PostContent.tsx
import "@/components/custom/tiptap/tiptap-editor-styles.css"
// hoặc dùng Tailwind prose

export function PostContent({ content }: { content: string }) {
  return (
    <article
      className="prose prose-lg max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
```

> ⚠️ **Bảo mật:** Nội dung HTML lưu trong database đến từ editor nội bộ (admin). Nếu sau này cho phép user input, cần sanitize HTML bằng `DOMPurify` trước khi render.

---

## 13. Các lưu ý quan trọng

### SSR / Hydration Mismatch

Editor được cấu hình với `immediatelyRender: false` để tránh lỗi hydration giữa server và client:

```tsx
const editor = useEditor({
  immediatelyRender: false,  // ✅ Bắt buộc với Next.js App Router
  // ...
})
```

Component đã có `"use client"` directive — không thể dùng trong Server Components.

### Không dùng trong Server Component

```tsx
// ❌ SAI — Server Component
export default async function Page() {
  return <TiptapEditor content="..." onChange={...} />
}

// ✅ ĐÚNG — Client Component
"use client"
export default function PostEditor() {
  return <TiptapEditor content="..." onChange={...} />
}
```

### Import CSS đúng chỗ

CSS phải được import trong layout bao bọc các trang dùng editor:

```tsx
// Đã có sẵn trong:
// app/dashboard/admin/layout.tsx

// Nếu dùng ở trang khác (blog editor, portfolio editor...), thêm import vào layout tương ứng
import "@/components/custom/tiptap/tiptap-editor-styles.css"
```

### Performance — tránh re-render không cần thiết

Khi dùng với React Hook Form, `onChange` không cần wrap trong `useCallback` vì `field.onChange` từ RHF đã ổn định. Nhưng khi dùng với state thủ công:

```tsx
// ✅ Dùng useCallback để tránh editor re-initialize
const handleChange = useCallback((html: string) => {
  setContent(html)
}, [])

<TiptapEditor content={content} onChange={handleChange} />
```
