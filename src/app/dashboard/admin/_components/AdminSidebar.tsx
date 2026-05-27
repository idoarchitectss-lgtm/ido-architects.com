"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, FileText, LogOut, Tag, Images, Briefcase, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/posts", label: "Quản lý bài viết", icon: FileText },
  { href: "/dashboard/admin/services", label: "Dịch vụ", icon: Briefcase },
  { href: "/dashboard/admin/contacts", label: "Yêu cầu liên hệ", icon: MessageSquare },
  { href: "/dashboard/admin/categories", label: "Chuyên mục", icon: Tag },
  { href: "/dashboard/admin/media", label: "Thư viện ảnh", icon: Images },
];

type User = { name?: string | null; email?: string | null };

export default function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link href="/dashboard/admin" className="font-bold text-lg tracking-tight">
          IDO Admin
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t">
        <p className="text-xs text-gray-500 truncate px-3 mb-2">{user.email}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 w-full"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
