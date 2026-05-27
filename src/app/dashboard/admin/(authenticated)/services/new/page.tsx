import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import ServiceForm from "../../../_components/ServiceForm";

export default function NewServicePage() {
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
        <h1 className="text-xl font-semibold text-gray-900">Tạo dịch vụ mới</h1>
      </div>
      <ServiceForm mode="create" />
    </div>
  );
}
