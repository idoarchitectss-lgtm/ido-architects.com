import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { findPostById } from "@/features/posts/services/post.service";
import { transformPost } from "@/features/posts/transforms/post.transform";
import PostForm from "../../../_components/PostForm";
import DeletePostButton from "../../../_components/DeletePostButton";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const raw = await findPostById(id);
  if (!raw) notFound();

  const post = transformPost(raw);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/admin/posts"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-3"
        >
          <ChevronLeftIcon size={14} />
          Quay lại danh sách
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Sửa bài viết</h1>
          <DeletePostButton id={id} title={post.title} />
        </div>
      </div>
      <PostForm mode="edit" post={post} />
    </div>
  );
}
