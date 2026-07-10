import type { PostType } from "@/features/posts/validations/post.schema";

export interface CategoryItem {
  id: string;
  type: PostType;
  name: string;
  slug: string;
  image?: string | null;
  postCount: number;
  createdAt: string;
}

export interface CategoryCreateInput {
  type: PostType;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface CategoryUpdateInput {
  type?: PostType;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
}
