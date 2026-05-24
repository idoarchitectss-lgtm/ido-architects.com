import { notFound } from "next/navigation";
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sửa bài viết</h1>
        <DeletePostButton id={id} title={post.title} />
      </div>
      <PostForm mode="edit" post={post} />
    </div>
  );
}
