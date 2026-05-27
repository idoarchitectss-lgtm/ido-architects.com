"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ServiceCreateSchema,
  ServiceUpdateSchema,
} from "@/features/company-services/validations/service.schema";
import type { ServiceResponse } from "@/features/company-services/types/service.types";
import { useCreateService } from "@/hooks/admin/services/useCreateService";
import { useUpdateService } from "@/hooks/admin/services/useUpdateService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MediaSelector } from "@/components/custom/media/media-selector";
import TiptapEditor from "@/components/custom/tiptap/tiptap-editor";
import "@/components/custom/tiptap/tiptap-editor-styles.css";
import { z } from "zod";

type CreateData = z.infer<typeof ServiceCreateSchema>;
type UpdateData = z.infer<typeof ServiceUpdateSchema>;

type Props =
  | { mode: "create"; service?: undefined }
  | { mode: "edit"; service: ServiceResponse };

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ServiceForm({ mode, service }: Props) {
  // ── Mutation hooks (goodseed pattern: useMutation + toast + invalidateQueries) ──
  const createMutation = useCreateService();
  const updateMutation = useUpdateService(service?.id ?? "");

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const schema = mode === "create" ? ServiceCreateSchema : ServiceUpdateSchema;

  const defaultValues =
    mode === "edit" && service
      ? {
          title: service.title,
          slug: service.slug,
          excerpt: service.excerpt ?? "",
          content: service.content ?? "",
          featuredImage: service.featuredImage ?? "",
          icon: service.icon ?? "",
          isPublished: service.isPublished,
          sortOrder: service.sortOrder,
          metaTitle: service.metaTitle ?? "",
          metaDesc: service.metaDesc ?? "",
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          featuredImage: "",
          icon: "",
          isPublished: false,
          sortOrder: 0,
          metaTitle: "",
          metaDesc: "",
        };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateData | UpdateData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as CreateData | UpdateData,
  });

  const title = watch("title");
  const isPublished = watch("isPublished");
  const featuredImage = watch("featuredImage");
  const content = watch("content");

  const handleTitleBlur = () => {
    if (mode === "create" && title && !watch("slug")) {
      setValue("slug", generateSlug(title));
    }
  };

  const onSubmit = (data: CreateData | UpdateData) => {
    if (mode === "create") {
      createMutation.mutate(data as CreateData);
    } else {
      updateMutation.mutate(data as UpdateData);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {(createMutation.isError || updateMutation.isError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {createMutation.error?.message ?? updateMutation.error?.message ?? "Đã xảy ra lỗi"}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main content ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Nội dung</h2>

            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề *</Label>
              <Input
                id="title"
                {...register("title")}
                onBlur={handleTitleBlur}
                placeholder="Tên dịch vụ"
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register("slug")}
                placeholder="ten-dich-vu"
                className="font-mono text-sm"
              />
              {errors.slug && (
                <p className="text-xs text-red-500">{errors.slug.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Tóm tắt</Label>
              <Textarea
                id="excerpt"
                {...register("excerpt")}
                placeholder="Mô tả ngắn về dịch vụ..."
                rows={3}
              />
            </div>
          </div>

          {/* Content editor */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
            <Label>Nội dung chi tiết</Label>
            <TiptapEditor
              content={content ?? ""}
              onChange={(val) => setValue("content", val)}
            />
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">SEO</h2>

            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input id="metaTitle" {...register("metaTitle")} placeholder="Title cho SEO" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDesc">Meta Description</Label>
              <Textarea
                id="metaDesc"
                {...register("metaDesc")}
                placeholder="Mô tả SEO..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────── */}
        <div className="space-y-5">
          {/* Publish */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Đăng tải</h2>

            <div className="flex items-center justify-between">
              <Label htmlFor="isPublished">Công khai</Label>
              <Switch
                id="isPublished"
                checked={!!isPublished}
                onCheckedChange={(val) => setValue("isPublished", val)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
              <Input
                id="sortOrder"
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? "Đang lưu..."
                  : mode === "create"
                  ? "Tạo dịch vụ"
                  : "Lưu thay đổi"}
              </Button>
            </div>
          </div>

          {/* Featured image */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
            <Label>Ảnh đại diện</Label>
            <MediaSelector
              selectedUrl={featuredImage ?? ""}
              onSelect={(item) => setValue("featuredImage", item.url)}
              onClear={() => setValue("featuredImage", "")}
              showPreview
            />
          </div>

          {/* Icon */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
            <Label htmlFor="icon">Icon (tên icon hoặc URL)</Label>
            <Input
              id="icon"
              {...register("icon")}
              placeholder="vd: settings, wrench, ..."
            />
            <p className="text-xs text-gray-400">
              Tên Lucide icon hoặc URL SVG/PNG
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
