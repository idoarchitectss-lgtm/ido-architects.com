import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500">
        Chào mừng, <span className="font-medium text-gray-700">{session.user?.name}</span>!
      </p>
    </div>
  );
}
