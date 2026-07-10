import "server-only";
import { prisma } from "@/lib/prisma";
import type { PostType } from "@/features/posts/validations/post.schema";
import type { CategoryCreateInput, CategoryUpdateInput } from "../validations/category.schema";

// ─── List all ─────────────────────────────────────────────────────────────────
export async function findAllCategories(type?: PostType) {
  return prisma.category.findMany({
    where: type ? { type } : undefined,
    orderBy: { name: "asc" },
    select: {
      id: true,
      type: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      createdAt: true,
      _count: { select: { posts: true } },
    },
  });
}

// ─── Find by id ───────────────────────────────────────────────────────────────
export async function findCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

// ─── Find by slug ─────────────────────────────────────────────────────────────
export async function findCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createCategory(data: CategoryCreateInput) {
  return prisma.category.create({ data });
}

// ─── Update ───────────────────────────────────────────────────────────────────
export async function updateCategory(id: string, data: CategoryUpdateInput) {
  return prisma.category.update({ where: { id }, data });
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}
