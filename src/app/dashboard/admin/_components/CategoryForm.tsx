"use client";

import { useEffect, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoryCreateSchema,
  CategoryUpdateSchema,
  type CategoryCreateInput,
  type CategoryUpdateInput,
} from "@/features/categories/validations/category.schema";
import { PostType } from "@/features/posts/validations/post.schema";
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
import { MediaSelector } from "@/components/custom/media/media-selector";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CategoryFormValues {
  type: PostType;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface CategoryFormProps {
  /** undefined = create mode */
  defaultValues?: CategoryFormValues;
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CategoryForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Lưu",
}: CategoryFormProps) {
  const isEdit = !!defaultValues;
  const schema = isEdit ? CategoryUpdateSchema : CategoryCreateSchema;
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryCreateInput | CategoryUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      type: PostType.BLOG_POST,
      name: "",
      slug: "",
      description: "",
      image: "",
    },
  });

  // reset khi defaultValues thay đổi (edit mode mở với category khác)
  useEffect(() => {
    reset(
      defaultValues ?? {
        type: PostType.BLOG_POST,
        name: "",
        slug: "",
        description: "",
        image: "",
      }
    );
  }, [defaultValues, reset]);

  const nameValue = watch("name") ?? "";

  const onNameBlur = () => {
    if (!isEdit && !watch("slug")) {
      setValue("slug", toSlug(nameValue));
    }
  };

  const handleFormSubmit = (data: CategoryCreateInput | CategoryUpdateInput) => {
    startTransition(async () => {
      await onSubmit(data as CategoryFormValues);
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-1">
      {/* Loại bài viết */}
      <div className="space-y-1.5">
        <Label htmlFor="cat-type">
          Loại bài viết <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="cat-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PostType.BLOG_POST}>Blog</SelectItem>
                <SelectItem value={PostType.PROJECT_POST}>Dự án</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <p className="text-xs text-red-500">{errors.type.message}</p>
        )}
      </div>

      {/* Tên */}
      <div className="space-y-1.5">
        <Label htmlFor="cat-name">
          Tên chuyên mục <span className="text-red-500">*</span>
        </Label>
        <Input
          id="cat-name"
          {...register("name")}
          onBlur={onNameBlur}
          placeholder="Thiết kế nội thất"
          autoFocus
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="cat-slug">
          Slug <span className="text-red-500">*</span>
        </Label>
        <Input
          id="cat-slug"
          {...register("slug")}
          placeholder="thiet-ke-noi-that"
          className="font-mono text-sm"
        />
        <p className="text-xs text-gray-400">
          Chỉ dùng chữ thường, số và dấu gạch ngang
        </p>
        {errors.slug && (
          <p className="text-xs text-red-500">{errors.slug.message}</p>
        )}
      </div>

      {/* Mô tả */}
      <div className="space-y-1.5">
        <Label htmlFor="cat-desc">Mô tả</Label>
        <Textarea
          id="cat-desc"
          {...register("description")}
          placeholder="Mô tả ngắn về chuyên mục..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Ảnh đại diện */}
      <div className="space-y-1.5">
        <Label>Ảnh đại diện</Label>
        <Controller
          name="image"
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
        {errors.image && (
          <p className="text-xs text-red-500">{errors.image.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Hủy
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Đang lưu..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
