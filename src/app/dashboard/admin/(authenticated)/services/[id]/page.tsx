import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { findServiceById } from "@/features/company-services/services/service.data";
import ServiceForm from "../../../_components/ServiceForm";
import DeleteServiceButton from "../../../_components/DeleteServiceButton";
import type { ServiceResponse } from "@/features/company-services/types/service.types";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const raw = await findServiceById(id);
  if (!raw) notFound();

  // Map Prisma model to ServiceResponse (dates → ISO strings)
  const service: ServiceResponse = {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt,
    content: raw.content,
    featuredImage: raw.featuredImage,
    icon: raw.icon,
    isPublished: raw.isPublished,
    sortOrder: raw.sortOrder,
    metaTitle: raw.metaTitle,
    metaDesc: raw.metaDesc,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/admin/services"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-3"
        >
          <ChevronLeftIcon size={14} />
          Quay lại danh sách
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Sửa dịch vụ</h1>
          <DeleteServiceButton id={id} title={service.title} />
        </div>
      </div>
      <ServiceForm mode="edit" service={service} />
    </div>
  );
}
