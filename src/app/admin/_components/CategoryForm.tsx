"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoryCreateSchema,
  CategoryUpdateSchema,
  type CategoryCreateInput,
  type CategoryUpdateInput,
} from "@/features/categories/validations/category.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  name: string;
  slug: string;
  description?: string;
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
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryCreateInput | CategoryUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { name: "", slug: "", description: "" },
  });

  // reset khi defaultValues thay đổi (edit mode mở với category khác)
  useEffect(() => {
    reset(defaultValues ?? { name: "", slug: "", description: "" });
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
