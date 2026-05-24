'use client';
import PostForm from "../../../_components/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tạo bài viết mới</h1>
      <PostForm mode="create" />
    </div>
  );
}
