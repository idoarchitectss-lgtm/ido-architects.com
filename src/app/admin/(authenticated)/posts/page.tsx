import Link from "next/link";
import { findManyPosts } from "@/features/posts/services/post.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostType } from "../../../../generated/prisma/client";

const TYPE_LABEL: Record<PostType, string> = {
  BLOG_POST: "Blog",
  PROJECT_POST: "Dự án",
};

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);
  const type = (sp.type as PostType | undefined) ?? undefined;

  const { posts, total } = await findManyPosts({
    page,
    size: 20,
    type,
    showAll: true,
  });

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bài viết ({total})</h1>
        <Link href="/admin/posts/new">
          <Button>+ Tạo bài viết</Button>
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[undefined, "BLOG_POST", "PROJECT_POST"].map((t) => (
          <Link
            key={t ?? "all"}
            href={t ? `/admin/posts?type=${t}` : "/admin/posts"}
          >
            <Button
              variant={type === t ? "default" : "outline"}
              size="sm"
            >
              {t ? TYPE_LABEL[t as PostType] : "Tất cả"}
            </Button>
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Tiêu đề</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">Loại</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">Trạng thái</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-36">Ngày đăng</th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium truncate max-w-xs">{post.title}</p>
                  <p className="text-gray-400 text-xs">{post.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{TYPE_LABEL[post.type]}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={post.isPublished ? "default" : "secondary"}>
                    {post.isPublished ? "Đã đăng" : "Nháp"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("vi-VN")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Chưa có bài viết nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`/admin/posts?page=${p}${type ? `&type=${type}` : ""}`}>
              <Button variant={p === page ? "default" : "outline"} size="sm">
                {p}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
