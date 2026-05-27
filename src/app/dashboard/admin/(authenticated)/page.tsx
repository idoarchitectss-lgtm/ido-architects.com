import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Images, Tag, Briefcase, ArrowRight, LayoutDashboard, MessageSquare } from "lucide-react";

const quickLinks = [
  {
    href: "/dashboard/admin/posts",
    icon: FileText,
    label: "Bài viết",
    description: "Quản lý bài viết và dự án",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100 hover:border-blue-300",
  },
  {
    href: "/dashboard/admin/services",
    icon: Briefcase,
    label: "Dịch vụ",
    description: "Quản lý danh mục dịch vụ",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100 hover:border-amber-300",
  },
  {
    href: "/dashboard/admin/contacts",
    icon: MessageSquare,
    label: "Yêu cầu liên hệ",
    description: "Quản lý yêu cầu từ khách hàng",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-100 hover:border-sky-300",
  },
  {
    href: "/dashboard/admin/categories",
    icon: Tag,
    label: "Chuyên mục",
    description: "Phân loại nội dung",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100 hover:border-violet-300",
  },
  {
    href: "/dashboard/admin/media",
    icon: Images,
    label: "Thư viện ảnh",
    description: "Upload & quản lý media",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100 hover:border-emerald-300",
  },
];

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 px-8 py-7 text-white shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-white/10 rounded-xl">
            <LayoutDashboard size={22} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-300 mb-0.5">{greeting},</p>
            <h1 className="text-2xl font-bold tracking-tight">
              {session.user?.name ?? "Admin"} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Đây là trang tổng quan quản trị — hãy bắt đầu quản lý nội dung website.
            </p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Truy cập nhanh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ href, icon: Icon, label, description, color, bg, border }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-4 rounded-xl border bg-white px-5 py-4 transition-all shadow-sm ${border}`}
            >
              <div className={`p-2.5 rounded-lg ${bg} flex-shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400 truncate">{description}</p>
              </div>
              <ArrowRight
                size={15}
                className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Info row */}
      <div className="rounded-xl border bg-white px-6 py-4 shadow-sm">
        <p className="text-sm text-gray-500">
          Đăng nhập với tài khoản{" "}
          <span className="font-medium text-gray-800">{session.user?.email}</span>
          {session.user?.role && (
            <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              {session.user.role}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
