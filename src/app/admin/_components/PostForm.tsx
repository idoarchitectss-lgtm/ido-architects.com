"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  PostCreateSchema,
  PostUpdateSchema,
  PostType,
} from "@/features/posts/validations/post.schema";
import type { PostResponse } from "@/features/posts/types/post.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X } from "lucide-react";
import MediaPicker from "@/app/admin/_components/MediaPicker";
import { MediaSelector } from "@/components/custom/media/media-selector";
import { generateSlug } from "@/features/posts/helpers/post.helpers";
import TiptapEditor from "@/components/custom/tiptap/tiptap-editor";
import "@/components/custom/tiptap/tiptap-editor-styles.css";
import { z } from "zod";

type CreateData = z.infer<typeof PostCreateSchema>;
type UpdateData = z.infer<typeof PostUpdateSchema>;

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

type Props =
  | { mode: "create"; post?: undefined }
  | { mode: "edit"; post: PostResponse };

export default function PostForm({ mode, post }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<CategoryOption[]>([]);
  // Tiptap — media picker
  const [tiptapMediaOpen, setTiptapMediaOpen] = useState(false);
  const [tiptapInsertFn, setTiptapInsertFn] = useState<((url: string) => void) | null>(null);

  const schema = mode === "create" ? PostCreateSchema : PostUpdateSchema;

  const defaultValues =
    mode === "edit" && post
      ? {
          type: post.type,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          featuredImage: post.featuredImage ?? "",
          isPublished: post.isPublished,
          publishedAt: post.publishedAt ?? null,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDesc ?? "",
          metaKeywords: post.metaKeywords ?? "",
          categories: post.categories.map((c) => c.id),
          tags: post.tags?.map((t) => t.id) ?? [],
          projectMeta: post.projectMeta ?? undefined,
        }
      : {
          type: PostType.BLOG_POST,
          isPublished: false,
          categories: [] as string[],
          tags: [] as string[],
        };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateData | UpdateData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as CreateData | UpdateData,
  });

  const postType = watch("type");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: CategoryOption[]) => setAllCategories(data))
      .catch(() => {});
  }, []);

  const onTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (mode === "create" && !watch("slug")) {
      setValue("slug", generateSlug(e.target.value));
    }
  };

  const onSubmit = async (data: CreateData | UpdateData) => {
    setLoading(true);
    setError(null);

    const url =
      mode === "create" ? "/api/posts" : `/api/posts/${post!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Có lỗi xảy ra");
      setLoading(false);
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">

      {/* ── Hàng đầu: Loại bài viết + Chuyên mục ─────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Type */}
        <div className="space-y-2">
          <Label>Loại bài viết</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={mode === "edit"}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PostType.BLOG_POST}>Blog</SelectItem>
                  <SelectItem value={PostType.PROJECT_POST}>Dự án</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Categories — dropdown multi-select */}
        <div className="space-y-2">
          <Label>Chuyên mục</Label>
          <Controller
            name="categories"
            control={control}
            render={({ field }) => {
              const selected: string[] = (field.value as string[]) ?? [];
              const toggle = (id: string) => {
                const next = selected.includes(id)
                  ? selected.filter((x) => x !== id)
                  : [...selected, id];
                field.onChange(next);
              };
              const removeOne = (id: string) => field.onChange(selected.filter((x) => x !== id));

              return (
                <div className="space-y-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                      >
                        <span className="text-muted-foreground">
                          {selected.length === 0
                            ? "Chọn chuyên mục..."
                            : `${selected.length} chuyên mục`}
                        </span>
                        <ChevronDown size={14} className="text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg" align="start">
                      {allCategories.length === 0 ? (
                        <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                          Chưa có chuyên mục nào
                        </div>
                      ) : (
                        <>
                          {allCategories.map((cat) => (
                            <DropdownMenuCheckboxItem
                              key={cat.id}
                              checked={selected.includes(cat.id)}
                              onCheckedChange={() => toggle(cat.id)}
                            >
                              {cat.name}
                            </DropdownMenuCheckboxItem>
                          ))}
                          {selected.length > 0 && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuCheckboxItem
                                checked={false}
                                onCheckedChange={() => field.onChange([])}
                                className="text-red-500 focus:text-red-600"
                              >
                                Bỏ chọn tất cả
                              </DropdownMenuCheckboxItem>
                            </>
                          )}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Badges hiển thị các mục đã chọn */}
                  {selected.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selected.map((id) => {
                        const cat = allCategories.find((c) => c.id === id);
                        if (!cat) return null;
                        return (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="gap-1 pr-1 text-xs"
                          >
                            {cat.name}
                            <button
                              type="button"
                              onClick={() => removeOne(id)}
                              className="rounded-full hover:bg-gray-300 p-0.5"
                            >
                              <X size={10} />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề *</Label>
        <Input
          id="title"
          {...register("title")}
          onBlur={onTitleBlur}
          placeholder="Nhập tiêu đề bài viết"
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input id="slug" {...register("slug")} placeholder="tieu-de-bai-viet" />
        {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Mô tả ngắn</Label>
        <Textarea id="excerpt" {...register("excerpt")} rows={3} placeholder="Tóm tắt bài viết..." />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label>Nội dung *</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TiptapEditor
              content={field.value as string}
              onChange={field.onChange}
              placeholder="Viết nội dung bài viết ở đây..."
              onOpenMediaPicker={(insertFn) => {
                setTiptapInsertFn(() => insertFn);
                setTiptapMediaOpen(true);
              }}
            />
          )}
        />
        {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
      </div>

      {/* Featured Image */}
      <div className="space-y-2">
        <Label>Ảnh đại diện</Label>
        <Controller
          name="featuredImage"
          control={control}
          render={({ field }) => (
            <MediaSelector
              selectedUrl={(field.value as string) || undefined}
              onSelect={(item) => field.onChange(item.url)}
              onClear={() => field.onChange("")}
              showPreview
              label="Chọn ảnh đại diện"
            />
          )}
        />
        {errors.featuredImage && (
          <p className="text-sm text-red-500">{errors.featuredImage.message}</p>
        )}
      </div>

      {/* Media Picker dành riêng cho Tiptap */}
      <MediaPicker
        open={tiptapMediaOpen}
        onClose={() => { setTiptapMediaOpen(false); setTiptapInsertFn(null); }}
        onSelect={(url) => {
          tiptapInsertFn?.(url);
          setTiptapInsertFn(null);
          setTiptapMediaOpen(false);
        }}
      />

      {/* Project Meta — chỉ hiện khi type = PROJECT_POST */}
      {postType === PostType.PROJECT_POST && (
        <fieldset className="border rounded-lg p-4 space-y-4">
          <legend className="text-sm font-medium px-1">Thông tin dự án</legend>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tên dự án</Label>
              <Input {...register("projectMeta.nameOfProject")} placeholder="Biệt thự Vinhomes..." />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ</Label>
              <Input {...register("projectMeta.addressOfProperty")} placeholder="Hà Nội" />
            </div>
            <div className="space-y-2">
              <Label>Năm hoàn thành</Label>
              <Input {...register("projectMeta.completedYear")} placeholder="2024" />
            </div>
            <div className="space-y-2">
              <Label>Diện tích sàn (m²)</Label>
              <Input type="number" {...register("projectMeta.floorDimension", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Số tầng</Label>
              <Input type="number" {...register("projectMeta.numberOfFloors", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Loại công trình</Label>
              <Input {...register("projectMeta.propertyType")} placeholder="Biệt thự" />
            </div>
          </div>

          <div className="flex gap-6">
            <Controller
              name="projectMeta.isFeatured"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch checked={!!field.value} onCheckedChange={field.onChange} id="isFeatured" />
                  <Label htmlFor="isFeatured">Dự án nổi bật</Label>
                </div>
              )}
            />
            <Controller
              name="projectMeta.isCompleted"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch checked={!!field.value} onCheckedChange={field.onChange} id="isCompleted" />
                  <Label htmlFor="isCompleted">Đã hoàn thành</Label>
                </div>
              )}
            />
          </div>
        </fieldset>
      )}

      {/* Publish */}
      <Controller
        name="isPublished"
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch checked={!!field.value} onCheckedChange={field.onChange} id="isPublished" />
            <Label htmlFor="isPublished">Xuất bản ngay</Label>
          </div>
        )}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : mode === "create" ? "Tạo bài viết" : "Lưu thay đổi"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Hủy
        </Button>
      </div>
    </form>
  );
}
