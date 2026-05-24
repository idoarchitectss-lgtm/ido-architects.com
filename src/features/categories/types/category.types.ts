export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: string;
}

export interface CategoryCreateInput {
  name: string;
  slug: string;
  description?: string;
}

export interface CategoryUpdateInput {
  name?: string;
  slug?: string;
  description?: string;
}
