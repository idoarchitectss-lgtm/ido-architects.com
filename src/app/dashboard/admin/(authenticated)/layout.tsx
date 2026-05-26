import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "../_components/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return (
    <div className="light flex min-h-screen bg-gray-100" style={{ colorScheme: "light" }}>
      <AdminSidebar user={session.user ?? {}} />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
      <Toaster theme="light" position="top-right" richColors />
    </div>
  );
}
