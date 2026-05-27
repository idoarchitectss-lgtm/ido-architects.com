"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  PostCreateSchema,
  PostUpdateSchema,
  PostType,
  PROPERTY_TYPES,
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
import MediaPicker from "@/app/dashboard/admin/_components/MediaPicker";
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
  const [tiptapMediaOpen, setTiptapMediaOpen] = useState(false);
  const [tiptapMediaMode, setTiptapMediaMode] = useState<"single" | "layout" | "gallery">("single");
  // Use refs for insert callbacks to avoid React treating functions as state updaters
  const tiptapInsertFnRef = useRef<((url: string) => void) | null>(null);
  const tiptapLayoutInsertFnRef = useRef<((urls: string[], cols: number) => void) | null>(null);
  // Gallery picker for PROJECT_POST
  const galleryInsertFnRef = useRef<((urls: string[]) => void) | null>(null);
  // Compare before/after flow
  const [compareStep, setCompareStep] = useState<"before" | "after" | null>(null);
  const compareStepRef = useRef<"before" | "after" | null>(null); // mirror for use in closures
  const compareBefore = useRef("");
  const compareInsertFnRef = useRef<((before: string, after: string) => void) | null>(null);
  const isCompareTransition = useRef(false); // true while closing modal between step 1→2

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
          projectMeta: post.projectMeta
            ? {
                ...post.projectMeta,
                galleryImages: post.projectMeta.galleryImages ?? [],
              }
            : undefined,
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

    const url = mode === "create" ? "/api/posts" : `/api/posts/${post!.id}`;
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

    router.push("/dashboard/admin/posts");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-3xl">

      {/* Card: Phân loại */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phân loại</h2>
        <div className="grid grid-cols-2 gap-4">

          <div className="space-y-1.5">
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

          <div className="space-y-1.5">
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
                          className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          <span className="text-muted-foreground">
                            {selected.length === 0 ? "Chọn chuyên mục..." : `${selected.length} chuyên mục`}
                          </span>
                          <ChevronDown size={14} className="text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg" align="start">
                        {allCategories.length === 0 ? (
                          <div className="px-2 py-3 text-xs text-muted-foreground text-center">Chua co chuyên mục</div>
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
                    {selected.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {selected.map((id) => {
                          const cat = allCategories.find((c) => c.id === id);
                          if (!cat) return null;
                          return (
                            <Badge key={id} variant="secondary" className="gap-1 pr-1 text-xs">
                              {cat.name}
                              <button type="button" onClick={() => removeOne(id)} className="rounded-full hover:bg-gray-300 p-0.5">
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
      </div>

      {/* Card: Nội dung */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nội dung</h2>
        <div className="space-y-1.5">
          <Label htmlFor="title">Tiêu đề *</Label>
          <Input id="title" {...register("title")} onBlur={onTitleBlur} placeholder="Nhập tiêu đề bài viết" />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" {...register("slug")} placeholder="tieu-de-bai-viet" className="font-mono text-sm" />
          {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="excerpt">Mô tả ngắn</Label>
          <Textarea id="excerpt" {...register("excerpt")} rows={3} placeholder="Tóm tắt bài viết..." />
        </div>
        <div className="space-y-1.5">
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
                  tiptapInsertFnRef.current = insertFn;
                  setTiptapMediaMode("single");
                  setTiptapMediaOpen(true);
                }}
                onOpenMediaPickerLayout={(insertFn) => {
                  tiptapLayoutInsertFnRef.current = insertFn;
                  setTiptapMediaMode("layout");
                  setTiptapMediaOpen(true);
                }}
                onOpenMediaPickerCompare={(insertFn) => {
                  compareInsertFnRef.current = insertFn;
                  compareStepRef.current = "before";
                  setCompareStep("before");
                  setTiptapMediaMode("single");
                  setTiptapMediaOpen(true);
                }}
              />
            )}
          />
          {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
        </div>
      </div>

      {/* Card: Ảnh đại diện */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ảnh đại diện</h2>
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
        {errors.featuredImage && <p className="text-xs text-red-500">{errors.featuredImage.message}</p>}
      </div>

      <MediaPicker
        open={tiptapMediaOpen}
        initialMode={tiptapMediaMode}
        hint={
          compareStep === "before" ? "Chọn ảnh TRƯỚC (bước 1/2)" :
          compareStep === "after"  ? "Chọn ảnh SAU (bước 2/2)" :
          undefined
        }
        onClose={() => {
          // Skip cleanup when transitioning between compare steps (step1→step2)
          if (isCompareTransition.current) {
            isCompareTransition.current = false;
            return;
          }
          setTiptapMediaOpen(false);
          tiptapInsertFnRef.current = null;
          tiptapLayoutInsertFnRef.current = null;
          compareInsertFnRef.current = null;
          compareStepRef.current = null;
          setCompareStep(null);
          compareBefore.current = "";
        }}
        onSelect={(url) => {
          const step = compareStepRef.current;
          // Compare before step
          if (step === "before") {
            compareBefore.current = url;
            compareStepRef.current = "after";
            setCompareStep("after");
            isCompareTransition.current = true;
            setTiptapMediaOpen(false);
            setTimeout(() => setTiptapMediaOpen(true), 150);
            return;
          }
          // Compare after step
          if (step === "after") {
            compareInsertFnRef.current?.(compareBefore.current, url);
            compareInsertFnRef.current = null;
            compareStepRef.current = null;
            setCompareStep(null);
            compareBefore.current = "";
            setTiptapMediaOpen(false);
            return;
          }
          // Normal single insert
          tiptapInsertFnRef.current?.(url);
          tiptapInsertFnRef.current = null;
          setTiptapMediaOpen(false);
        }}
        onSelectMultiple={(urls, cols) => {
          // Gallery mode takes priority
          if (galleryInsertFnRef.current) {
            galleryInsertFnRef.current(urls);
            galleryInsertFnRef.current = null;
            setTiptapMediaOpen(false);
            return;
          }
          tiptapLayoutInsertFnRef.current?.(urls, cols);
          tiptapLayoutInsertFnRef.current = null;
          setTiptapMediaOpen(false);
        }}
      />

      {/* Card: Thông tin dự án */}
      {postType === PostType.PROJECT_POST && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Thông tin dự án</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Tên dự án</Label>
              <Input {...register("projectMeta.nameOfProject")} placeholder="Biệt thự Vinhomes..." />
            </div>
            <div className="space-y-1.5">
              <Label>Địa chỉ</Label>
              <Input {...register("projectMeta.addressOfProperty")} placeholder="Hà Nội" />
            </div>
            <div className="space-y-1.5">
              <Label>Năm hoàn thành</Label>
              <Input {...register("projectMeta.completedYear")} placeholder="2024" />
            </div>
            <div className="space-y-1.5">
              <Label>Diện tích sàn (m²)</Label>
              <Input type="number" {...register("projectMeta.floorDimension", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Số tầng</Label>
              <Input type="number" {...register("projectMeta.numberOfFloors", { valueAsNumber: true })} />
            </div>
            <div className="space-y-1.5">
              <Label>Loại công trình</Label>
              <Controller
                name="projectMeta.propertyType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại công trình..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((pt) => (
                        <SelectItem key={pt.value} value={pt.value}>
                          {pt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="flex gap-6 pt-3 border-t border-gray-100">
            <Controller
              name="projectMeta.isFeatured"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch checked={!!field.value} onCheckedChange={field.onChange} id="isFeatured" />
                  <Label htmlFor="isFeatured" className="font-normal cursor-pointer">Dự án nổi bật</Label>
                </div>
              )}
            />
            <Controller
              name="projectMeta.isCompleted"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch checked={!!field.value} onCheckedChange={field.onChange} id="isCompleted" />
                  <Label htmlFor="isCompleted" className="font-normal cursor-pointer">Đã hoàn thành</Label>
                </div>
              )}
            />
          </div>

          {/* ── Gallery Images ── */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Ảnh gallery dự án</p>
                <p className="text-xs text-gray-400 mt-0.5">Ảnh sẽ hiển thị trong phần gallery đầu trang chi tiết dự án</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  galleryInsertFnRef.current = (urls: string[]) => {
                    const current = (watch("projectMeta.galleryImages") as string[] | undefined) ?? [];
                    // Dedupe
                    const next = [...current, ...urls.filter((u) => !current.includes(u))];
                    setValue("projectMeta.galleryImages", next);
                  };
                  setTiptapMediaMode("gallery");
                  setTiptapMediaOpen(true);
                }}
              >
                + Thêm ảnh
              </Button>
            </div>

            <Controller
              name="projectMeta.galleryImages"
              control={control}
              render={({ field }) => {
                const images = (field.value as string[] | undefined) ?? [];
                if (images.length === 0) {
                  return (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-400">
                      Chưa có ảnh nào. Nhấn &quot;+ Thêm ảnh&quot; để chọn từ thư viện.
                    </div>
                  );
                }
                return (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {images.map((url, idx) => (
                      <div key={url} className="relative group aspect-square rounded-md overflow-hidden border border-gray-200 bg-neutral-50">
                        <img
                          src={url}
                          alt={`gallery-${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Order badge */}
                        <span className="absolute top-1 left-1 bg-black/50 text-white text-[10px] font-semibold rounded px-1 leading-4">
                          {idx + 1}
                        </span>
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => {
                            const next = images.filter((_, i) => i !== idx);
                            field.onChange(next);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          title="Xóa ảnh"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          </div>
        </div>
      )}

      {/* Card: Xuất bản */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Xuất bản</p>
                <p className="text-xs text-gray-500 mt-0.5">Bài viết sẽ hiển thị công khai trên website</p>
              </div>
              <Switch checked={!!field.value} onCheckedChange={field.onChange} id="isPublished" />
            </div>
          )}
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-3 pb-6">
        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : mode === "create" ? "Tạo bài viết" : "Lưu thay đổi"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
      </div>
    </form>
  );
}
