'use client';
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import PostForm from "../../../_components/PostForm";

export default function NewPostPage() {
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
        <h1 className="text-xl font-semibold text-gray-900">Tạo bài viết mới</h1>
      </div>
      <PostForm mode="create" />
    </div>
  );
}
