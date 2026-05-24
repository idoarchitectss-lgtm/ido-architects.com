# Hướng dẫn Quản lý Media trong LemsTech

> **Phiên bản tài liệu:** 1.0  
> **Cập nhật lần cuối:** 2026-05-23  
> **Áp dụng cho:** Chức năng Media Management — Upload, Quản lý, Tích hợp vào Form

---

## Mục lục

1. [Kiến trúc tổng quan](#1-kiến-trúc-tổng-quan)
2. [Cấu trúc file & thư mục](#2-cấu-trúc-file--thư-mục)
3. [Data Model & Types](#3-data-model--types)
4. [Biến môi trường Cloudinary](#4-biến-môi-trường-cloudinary)
5. [API Routes](#5-api-routes)
6. [Service Layer](#6-service-layer)
7. [Custom Hooks](#7-custom-hooks)
8. [Components Media](#8-components-media)
9. [Trang Admin Media](#9-trang-admin-media)
10. [Upload ảnh — MediaUploader](#10-upload-ảnh--mediauploader)
11. [Chọn ảnh trong Form — MediaSelector](#11-chọn-ảnh-trong-form--mediaselector)
12. [Đồng bộ Cloudinary ↔ Database](#12-đồng-bộ-cloudinary--database)
13. [Bulk Operations](#13-bulk-operations)
14. [Folders & Tổ chức ảnh](#14-folders--tổ-chức-ảnh)
15. [Lưu ý quan trọng](#15-lưu-ý-quan-trọng)

---

## 1. Kiến trúc tổng quan

Hệ thống media của LemsTech sử dụng **Cloudinary** làm nơi lưu trữ ảnh thực sự, kết hợp với **PostgreSQL (Prisma)** để index và tìm kiếm nhanh.

```
                    ┌─────────────────┐
                    │   Cloudinary    │  ← Lưu trữ file thực (CDN)
                    └────────┬────────┘
                             │ sync
                    ┌────────▼────────┐
                    │  PostgreSQL DB  │  ← Index metadata (URL, folder, tags, ...)
                    │  (Image table)  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
  API Routes          Service Layer         React Query
  /api/media/...    media.service.ts     useMedia() hook
         │                   │                   │
         └───────────────────▼───────────────────┘
                        UI Components
              (MediaUploader, MediaSelector, MediaGrid, ...)
```

**Nguyên tắc:**
- **Upload:** File → Cloudinary → metadata được lưu vào DB
- **Hiển thị:** Đọc từ DB (nhanh) → URL trỏ đến Cloudinary CDN
- **Sync:** Khi DB và Cloudinary bị lệch → gọi `POST /api/media/sync`
- **Cache:** React Query cache ở client, SessionStorage tùy chọn

---

## 2. Cấu trúc file & thư mục

```
app/
├── api/media/
│   ├── route.ts                        # GET (danh sách), POST (upload)
│   ├── [id]/route.ts                   # GET, PATCH (cập nhật), DELETE (xóa)
│   ├── sync/route.ts                   # POST — đồng bộ Cloudinary → DB
│   ├── bulk-sync/route.ts              # POST — sync hàng loạt
│   ├── bulk/route.ts                   # PUT (bulk update), DELETE (bulk delete), PATCH (bulk tag)
│   ├── folders/route.ts                # GET — danh sách folders
│   ├── count/route.ts                  # GET — đếm tổng số media
│   ├── analytics/route.ts             # GET — thống kê media
│   ├── advanced-search/route.ts       # GET — tìm kiếm nâng cao
│   ├── optimization/route.ts          # GET — gợi ý tối ưu hóa
│   └── cleanup/route.ts               # POST — dọn dẹp orphaned media
│
├── dashboard/admin/media/
│   └── page.tsx                        # Trang quản lý media
│
components/custom/media/
│   ├── index.ts                        # Barrel export
│   ├── media-uploader.tsx              # Upload ảnh (drag & drop, multi-file)
│   ├── media-selector.tsx              # Chọn ảnh trong form (dialog)
│   ├── media-grid.tsx                  # Hiển thị dạng grid
│   ├── media-list.tsx                  # Hiển thị dạng list
│   ├── media-sync-button.tsx           # Nút trigger sync Cloudinary
│   ├── media-sync-status.tsx           # Trạng thái sync
│   ├── advanced-search.tsx             # UI tìm kiếm nâng cao
│   ├── gallery-dialog.tsx              # Gallery view dialog
│   ├── DeleteImage.tsx                 # Xóa ảnh
│   └── UpdateImageBtn.tsx              # Cập nhật metadata ảnh
│
hooks/
│   ├── use-media.ts                    # Hook chính (CRUD + pagination + React Query)
│   ├── use-media-query.ts              # Hook query danh sách
│   ├── use-media-folders.ts            # Hook lấy folders
│   ├── use-media-features.ts           # Hook cho advanced features
│   └── use-media-advanced.ts           # Hook tìm kiếm nâng cao
│
lib/
│   ├── services/media.service.ts       # MediaService class
│   ├── services/media.types.ts         # Service-level types
│   ├── validations/media.ts            # Zod schemas
│   ├── constants/media.ts              # FOLDERS, ALLOWED_FILE_TYPES, MAX_FILE_SIZE
│   └── cloudinary.ts                   # Cloudinary SDK config
│
types/
│   └── media.ts                        # MediaItem, MediaQuery, MediaUpload, ...
```

---

## 3. Data Model & Types

### Prisma Model

```prisma
model Image {
  id          String    @id @default(uuid())
  url         String
  publicId    String?   // Cloudinary public_id
  folder      String?   @default("general")
  filename    String?
  description String?
  alt_text    String?
  tags        String[]
  format      String?
  width       Int?
  height      Int?
  size        Int?
  usage_count Int       @default(0)
  last_used_at DateTime?
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt
}
```

### Types chính (`types/media.ts`)

```typescript
// MediaItem — type đã transform cho UI
export type MediaItem = {
  id: string
  url: string
  publicId?: string | null
  folder?: string | null      // "general" | "posts" | "products" | "ai-tools" | ...
  filename?: string | null
  format?: 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif' | 'svg' | null
  width?: number | null
  height?: number | null
  size?: number | null         // bytes
  description?: string | null
  altText?: string | null
  tags: string[]
  usageCount: number
  lastUsedAt?: string | null
  createdAt: string
  updatedAt?: string
}

// MediaUpload — payload khi upload file
export type MediaUpload = {
  file: File
  folder?: string
  description?: string
  altText?: string
  tags?: string[]
}

// MediaQuery — filter params cho GET /api/media
export type MediaQuery = {
  page?: number
  limit?: number
  search?: string
  folder?: string
  format?: string
  sortBy?: 'createdAt' | 'filename' | 'size' | 'usageCount'
  sortOrder?: 'asc' | 'desc'
  tags?: string[]
}
```

---

## 4. Biến môi trường Cloudinary

Thêm vào `.env.local`:

```env
# Cloudinary — bắt buộc
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Public (dùng cho CldImage component của next-cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

> ⚠️ **Lưu ý:** `CLOUDINARY_API_SECRET` chỉ dùng ở server-side (API routes). Không bao giờ expose ra client.

---

## 5. API Routes

### 5.1 GET — Danh sách media

```
GET /api/media?page=1&limit=20&folder=posts&search=banner
```

| Param | Type | Mô tả |
|---|---|---|
| `page` | number | Trang (default: 1) |
| `limit` | number | Số item/trang (default: 20, max: 100) |
| `folder` | string | Filter theo folder (`all` = không filter) |
| `search` | string | Tìm theo filename/ID |

**Response:**
```json
{
  "media": [...],
  "pagination": { "page": 1, "totalPages": 5, "total": 98, "hasNext": true, "hasPrev": false },
  "filters": { "totalByFormat": { "jpg": 50, "png": 30 }, "totalByFolder": { "posts": 40 } }
}
```

### 5.2 POST — Upload ảnh mới

```
POST /api/media
Content-Type: multipart/form-data

file: <binary>
folder: "posts"
description: "Banner bài viết"
altText: "Alt text mô tả"
tags: ["banner", "hero"]
```

**Response:**
```json
{
  "success": true,
  "media": { "id": "uuid", "url": "https://res.cloudinary.com/...", "folder": "posts", ... }
}
```

### 5.3 GET — Chi tiết ảnh

```
GET /api/media/[id]
```

### 5.4 PATCH — Cập nhật metadata

```
PATCH /api/media/[id]
Body: { "altText": "New alt text", "description": "Updated desc", "tags": ["new-tag"] }
```

### 5.5 DELETE — Xóa ảnh

```
DELETE /api/media/[id]
```

Xóa đồng thời trên Cloudinary **và** trong DB.

### 5.6 POST — Sync Cloudinary → DB

```
POST /api/media/sync
```

Quét toàn bộ ảnh từ Cloudinary, upsert vào DB. Dùng khi DB và Cloudinary bị lệch nhau.

### 5.7 GET — Folders

```
GET /api/media/folders
```

Trả về danh sách folders hiện có trong DB.

### 5.8 Bulk Operations

```
DELETE /api/media/bulk    Body: { "ids": ["id1", "id2", ...] }
PUT    /api/media/bulk    Body: { "updates": [{ "id": "...", "data": {...} }] }
PATCH  /api/media/bulk    Body: { "ids": [...], "operation": "add"|"remove"|"replace", "tags": [...] }
```

---

## 6. Service Layer

File: `lib/services/media.service.ts`

### Import

```typescript
import { mediaService } from "@/lib/services/media.service"
```

### Các method chính

```typescript
// Lấy danh sách
await mediaService.getMedia(query: MediaQuery): Promise<MediaResponse>

// Upload file
await mediaService.uploadMedia(data: MediaUpload): Promise<MediaItem>

// Xóa ảnh
await mediaService.deleteMedia(id: string): Promise<void>

// Cập nhật metadata
await mediaService.updateMedia(id: string, data: Partial<MediaItem>): Promise<MediaItem>

// Bulk delete
await mediaService.bulkDeleteMedia(ids: string[]): Promise<BulkDeleteResult>

// Lấy chi tiết
await mediaService.getMediaById(id: string): Promise<MediaItem>

// Analytics
await mediaService.getAnalytics(): Promise<MediaAnalytics>
```

### Cache

`mediaService` sử dụng `MediaCache` class tích hợp (SessionStorage). Mặc định cache 5 phút.

```typescript
// Xóa cache thủ công
mediaService.clearCache()
mediaService.clearMediaCache(key)
```

---

## 7. Custom Hooks

### 7.1 `useMedia` — Hook chính (React Query)

```typescript
import { useMedia } from "@/hooks/use-media"

const {
  media,           // MediaItem[]
  isLoading,
  isError,
  error,
  pagination,      // { page, totalPages, total, hasNext, hasPrev }

  uploadMedia,     // (data: MediaUpload) => Promise<MediaItem>
  deleteMedia,     // (id: string) => Promise<void>
  updateMedia,     // (id: string, data: Partial<MediaItem>) => Promise<MediaItem>

  isUploading,
  uploadProgress,  // 0–100
  isDeleting,
  deletingIds,     // string[] — IDs đang trong quá trình xóa

  refetch,
  invalidateCache,

  filterParams,
  setFilterParams,  // (params: Partial<MediaQuery>) => void
  resetFilters,
} = useMedia({
  enableAutoQuery: true,
  defaultParams: { page: 1, limit: 20, folder: "posts" },
  onUploadSuccess: (media) => console.log("Uploaded:", media),
  onDeleteSuccess: (id) => console.log("Deleted:", id),
})
```

**React Query integration:** Hook dùng `@tanstack/react-query` nên cache được chia sẻ giữa các component. Khi upload/xóa xong, cache tự động invalidate và refetch.

### 7.2 `useMediaFolders` — Lấy danh sách folders

```typescript
import { useMediaFolders } from "@/hooks/use-media-folders"

const { folders, isLoading } = useMediaFolders()
// folders = [{ label: "Posts", value: "posts" }, ...]
```

### 7.3 `useMediaAnalytics`

```typescript
import { useMediaAnalytics } from "@/hooks/use-media"

const { analytics, performanceMetrics, isLoading } = useMediaAnalytics()
// analytics.totalItems, analytics.totalSize, analytics.formatDistribution, ...
```

---

## 8. Components Media

### Import (barrel)

```typescript
import { MediaUploader, MediaSelector, MediaGrid, MediaList } from "@/components/custom/media"
```

### Tổng quan các component

| Component | Mục đích | Dùng ở đâu |
|---|---|---|
| `MediaUploader` | Upload file (drag & drop, multi) | Trang admin media, dialog upload |
| `MediaSelector` | Chọn ảnh đã có trong thư viện | Trong form (post, product, ...) |
| `MediaGrid` | Hiển thị grid ảnh + delete | Trang admin media |
| `MediaList` | Hiển thị dạng bảng danh sách | Trang admin media |
| `MediaSyncButton` | Nút trigger sync Cloudinary | Admin media page header |
| `MediaSyncStatus` | Hiển thị trạng thái sync | Admin media page |
| `DeleteImage` | Button xóa ảnh đơn | Trong MediaGrid |
| `UpdateImageBtn` | Cập nhật alt text, tags, folder | Trong MediaGrid |

---

## 9. Trang Admin Media

File: `app/dashboard/admin/media/page.tsx`

### Tính năng

- **Grid/List toggle** — chuyển đổi chế độ xem
- **Search** theo filename
- **Filter** theo folder
- **Upload** ảnh mới qua Dialog
- **Bulk select & delete** nhiều ảnh
- **Sync** Cloudinary → DB
- **Analytics** thống kê (tổng ảnh, size, phân bố format)
- **Phân trang**

### Ví dụ sử dụng hook trong trang admin

```tsx
"use client"

import { useMedia } from "@/hooks/use-media"
import { useMediaFolders } from "@/hooks/use-media-folders"
import { MediaGrid, MediaList, MediaUploader } from "@/components/custom/media"
import { PAGE_SIZE } from "@/lib/constants/media"

export default function MediaAdminPage() {
  const [search, setSearch] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { folders } = useMediaFolders()

  const {
    media,
    isLoading,
    pagination,
    setFilterParams,
    deleteMedia,
    refetch,
  } = useMedia({
    enableAutoQuery: true,
    defaultParams: { page: 1, limit: PAGE_SIZE },
  })

  // Sync filter params khi search/folder/page thay đổi
  useEffect(() => {
    setFilterParams({
      page: currentPage,
      limit: PAGE_SIZE,
      ...(selectedFolder !== "all" && { folder: selectedFolder }),
      ...(search && { search }),
    })
  }, [search, selectedFolder, currentPage, setFilterParams])

  return (
    <div>
      {/* Controls */}
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm..." />
      <Select value={selectedFolder} onValueChange={setSelectedFolder}>
        {folders.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
      </Select>

      {/* Content */}
      {viewMode === "grid"
        ? <MediaGrid media={media} onDelete={deleteMedia} />
        : <MediaList media={media} onDelete={deleteMedia} />
      }

      {/* Pagination */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={pagination?.totalPages || 1}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
```

---

## 10. Upload ảnh — MediaUploader

### Props

```typescript
interface MediaUploaderProps {
  onUploadSuccess: (result: MediaItem) => void  // Callback sau upload thành công
  folder?: string         // Folder đích (default: "general")
  maxFiles?: number       // Số file tối đa (default: 10)
  maxFileSize?: number    // MB (default: 10MB)
  acceptedTypes?: string[] // MIME types (default: jpg, png, gif, webp)
  enableBulkUpload?: boolean // Cho phép upload nhiều file (default: true)
}
```

### Sử dụng

```tsx
import { MediaUploader } from "@/components/custom/media"
import type { MediaItem } from "@/types/media"

<MediaUploader
  folder="posts"
  maxFiles={5}
  maxFileSize={5}
  onUploadSuccess={(media: MediaItem) => {
    console.log("Uploaded:", media.url)
    // Gán vào form field, cập nhật state, ...
  }}
/>
```

### Upload trong Dialog

```tsx
<Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
  <DialogTrigger asChild>
    <Button>
      <Upload className="h-4 w-4 mr-2" />
      Upload ảnh mới
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Upload ảnh</DialogTitle>
    </DialogHeader>
    <MediaUploader
      folder={selectedFolder !== "all" ? selectedFolder : "general"}
      onUploadSuccess={(media) => {
        setUploadDialogOpen(false)
        refetch() // reload danh sách sau upload
      }}
    />
  </DialogContent>
</Dialog>
```

### Upload trực tiếp qua hook

```tsx
const { uploadMedia, isUploading, uploadProgress } = useMedia()

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const media = await uploadMedia({
    file,
    folder: "posts",
    altText: "Featured image",
    tags: ["featured"],
  })

  console.log("Uploaded URL:", media.url)
}
```

---

## 11. Chọn ảnh trong Form — MediaSelector

`MediaSelector` là component dùng để **chọn ảnh đã có trong thư viện** (không upload mới) khi điền form. Được dùng trong TiptapEditor, form Post, form Product, ...

### Props

```typescript
interface MediaSelectorProps {
  onSelect: (media: MediaItem[]) => void   // Callback khi confirm selection
  selectedMedia: MediaItem[]               // Ảnh đang được chọn
  multiple?: boolean                       // Cho phép chọn nhiều (default: false)
  maxItems?: number                        // Giới hạn số ảnh (default: không giới hạn)
  folder?: string                          // Lọc theo folder khi mở
  onFeaturedSelect?: (id: string) => void  // Đánh dấu ảnh featured
  featuredMediaId?: string                 // ID ảnh featured hiện tại
  className?: string
}
```

### Tích hợp vào form chọn Ảnh đại diện (Featured Image)

```tsx
import { MediaSelector } from "@/components/custom/media"
import type { MediaItem } from "@/types/media"

// Trong PostForm component
const [featuredImage, setFeaturedImage] = useState<MediaItem | null>(null)

<FormField
  control={form.control}
  name="featuredImage"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Ảnh đại diện</FormLabel>
      <FormControl>
        <div className="space-y-3">
          {/* Preview ảnh đã chọn */}
          {featuredImage && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <img src={featuredImage.url} alt={featuredImage.altText || ""} className="object-cover w-full h-full" />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => { setFeaturedImage(null); field.onChange(null) }}
              >
                Xóa
              </Button>
            </div>
          )}

          {/* Selector dialog */}
          <MediaSelector
            onSelect={(items) => {
              const selected = items[0] || null
              setFeaturedImage(selected)
              field.onChange(selected ? { id: selected.id } : null)
            }}
            selectedMedia={featuredImage ? [featuredImage] : []}
            multiple={false}
            maxItems={1}
            folder="posts"
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Tích hợp chọn nhiều ảnh (Gallery)

```tsx
const [galleryImages, setGalleryImages] = useState<MediaItem[]>([])

<MediaSelector
  onSelect={(items) => {
    setGalleryImages(items)
    form.setValue("images", items.map(img => ({ id: img.id })))
  }}
  selectedMedia={galleryImages}
  multiple={true}
  maxItems={10}
/>
```

---

## 12. Đồng bộ Cloudinary ↔ Database

Khi upload trực tiếp lên Cloudinary (không qua hệ thống) hoặc xóa/di chuyển folder trên Cloudinary dashboard, DB sẽ bị lệch. Dùng Sync để đồng bộ lại.

### Qua UI (admin)

Nhấn nút **"Sync Cloudinary"** trên trang `/dashboard/admin/media`. Component `MediaSyncButton` sẽ gọi `POST /api/media/sync`.

### Qua API trực tiếp

```bash
curl -X POST /api/media/sync
```

**Luồng sync:**
1. Lấy toàn bộ resources từ Cloudinary API
2. Với mỗi resource: upsert vào DB (thêm nếu chưa có, bỏ qua nếu đã có)
3. Trả về: `{ syncedCount, skippedCount, errorCount, cloudinaryTotal }`

### Component MediaSyncButton

```tsx
import { MediaSyncButton } from "@/components/custom/media/media-sync-button"

<MediaSyncButton onSyncComplete={() => refetch()} />
```

---

## 13. Bulk Operations

### Bulk delete qua hook

```tsx
const { deleteMedia } = useMedia()
const [selectedIds, setSelectedIds] = useState<string[]>([])

const handleBulkDelete = async () => {
  // Xóa tuần tự với Promise.all
  await Promise.all(selectedIds.map(id => deleteMedia(id)))
  setSelectedIds([])
  refetch()
}
```

### Bulk delete qua API trực tiếp

```typescript
await mediaService.bulkDeleteMedia(selectedIds)
// hoặc
await fetch("/api/media/bulk", {
  method: "DELETE",
  body: JSON.stringify({ ids: selectedIds }),
})
```

### Bulk update tags

```typescript
await fetch("/api/media/bulk", {
  method: "PATCH",
  body: JSON.stringify({
    ids: selectedIds,
    operation: "add",   // "add" | "remove" | "replace"
    tags: ["featured", "hero"],
  }),
})
```

### Bulk update metadata

```typescript
await fetch("/api/media/bulk", {
  method: "PUT",
  body: JSON.stringify({
    updates: [
      { id: "uuid1", data: { folder: "posts", altText: "Post banner" } },
      { id: "uuid2", data: { folder: "products" } },
    ],
  }),
})
```

---

## 14. Folders & Tổ chức ảnh

### Danh sách folders hiện tại

Định nghĩa tại `lib/constants/media.ts`:

```typescript
export const FOLDERS = [
  { label: "All",      value: "all" },       // Không filter
  { label: "General",  value: "general" },   // Ảnh chung
  { label: "Posts",    value: "posts" },     // Ảnh bài viết
  { label: "Products", value: "products" },  // Ảnh sản phẩm
  { label: "AI Tools", value: "ai-tools" },  // Ảnh AI tools
  { label: "Samples",  value: "samples" },   // Ảnh mẫu
  { label: "Team",     value: "team" },      // Ảnh team
  { label: "Uploads",  value: "uploads" },   // Upload lẻ
]
```

> ⚠️ **Đồng bộ với Cloudinary:** Các folder này phải khớp với folder thực trên Cloudinary. Nếu thêm folder mới, cần:
> 1. Tạo folder trên Cloudinary dashboard
> 2. Thêm vào `FOLDERS` constant trong `lib/constants/media.ts`

### Thêm folder mới

```typescript
// lib/constants/media.ts
export const FOLDERS = [
  // ... existing folders
  { label: "Portfolio", value: "portfolio" },  // Thêm mới
]
```

### Chỉ định folder khi upload

```tsx
<MediaUploader folder="posts" ... />
```

---

## 15. Lưu ý quan trọng

### Format ảnh được hỗ trợ

```typescript
// lib/constants/media.ts
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
export const MAX_FILE_SIZE = 5 * 1024 * 1024  // 5MB
```

### Hiển thị ảnh Cloudinary — dùng `CldImage`

Thay vì dùng `<img>` thông thường, nên dùng `CldImage` của `next-cloudinary` để có responsive + lazy load:

```tsx
import { CldImage } from "next-cloudinary"

<CldImage
  src={media.publicId || media.url}   // Nên dùng publicId nếu có
  alt={media.altText || ""}
  width={media.width || 800}
  height={media.height || 600}
  crop="fill"
  gravity="auto"
/>
```

### Không tạo Cloudinary config trùng lặp

Cloudinary đã được config tập trung tại `lib/cloudinary.ts`. Các API routes nào cần dùng cloudinary thì import từ đây:

```typescript
// ✅ ĐÚNG
import cloudinary from "@/lib/cloudinary"

// ❌ SAI — không config lại trong từng route
import { v2 as cloudinary } from "cloudinary"
cloudinary.config({ ... })  // Không làm thế này
```

### React Query — Provider phải được wrap

`useMedia` dùng React Query. Đảm bảo `QueryClientProvider` đã được bao bọc trong layout:

```tsx
// components/providers/...
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### usageCount — tracking tần suất sử dụng

Khi ảnh được gán vào Post/Product, field `usage_count` trong DB nên được tăng lên. Hiện tại chưa auto-track — nếu cần có thể thêm logic trong service layer.

### Cleanup orphaned media

Ảnh đã upload nhưng chưa gán vào bất kỳ entity nào (post, product, ...) có thể tích lũy theo thời gian. Dùng endpoint cleanup để xóa:

```bash
POST /api/media/cleanup
```

Endpoint này sẽ kiểm tra các ảnh có `usage_count = 0` và không được tham chiếu trong bất kỳ bảng nào, sau đó xóa khỏi cả Cloudinary lẫn DB.
