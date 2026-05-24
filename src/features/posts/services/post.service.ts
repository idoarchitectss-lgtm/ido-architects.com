import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma, PostType } from "../../../../generated/prisma/client";
import type { PostWithRelations } from "../types/post.types";
import type { PostInput, PostUpdateInput, PostQuery } from "../validations/post.schema";

const POST_INCLUDE = {
  author: { select: { name: true } },
  categories: { select: { id: true, name: true, slug: true } },
  tags: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.PostInclude;

// ─── Resolve slug → id (dùng cho public routes) ───────────────────────────────
export async function resolveSlugToId(slug: string): Promise<string | null> {
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true },
  });
  return post?.id ?? null;
}

// ─── Find many (list) ─────────────────────────────────────────────────────────
export async function findManyPosts(
  query: PostQuery
): Promise<{ posts: PostWithRelations[]; total: number }> {
  const { type, page, size, showAll, isFeatured, isCompleted } = query;

  const where: Prisma.PostWhereInput = {};

  if (type) where.type = type;

  // Chỉ lấy published trừ khi admin gọi với showAll=true
  if (!showAll) {
    where.isPublished = true;
    where.publishedAt = { lte: new Date() };
  }

  // JSON path filter cho projectMeta (chỉ có nghĩa với PROJECT_POST)
  if (type === PostType.PROJECT_POST) {
    if (isFeatured !== undefined) {
      where.projectMeta = {
        path: ["isFeatured"],
        equals: isFeatured,
      };
    }
    if (isCompleted !== undefined) {
      where.projectMeta = {
        path: ["isCompleted"],
        equals: isCompleted,
      };
    }
  }

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      include: POST_INCLUDE,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * size,
      take: size,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts: posts as PostWithRelations[], total };
}

// ─── Find by id ───────────────────────────────────────────────────────────────
export async function findPostById(id: string): Promise<PostWithRelations | null> {
  const post = await prisma.post.findUnique({
    where: { id },
    include: POST_INCLUDE,
  });
  return post as PostWithRelations | null;
}

// ─── Find by slug (public — đã published) ────────────────────────────────────
export async function findPostBySlug(slug: string): Promise<PostWithRelations | null> {
  const post = await prisma.post.findFirst({
    where: {
      slug,
      isPublished: true,
      publishedAt: { lte: new Date() },
    },
    include: POST_INCLUDE,
  });
  return post as PostWithRelations | null;
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createPost(
  data: PostInput,
  authorId: string
): Promise<PostWithRelations> {
  const { categories, tags, projectMeta, ...rest } = data;

  const post = await prisma.post.create({
    data: {
      ...rest,
      featuredImage: rest.featuredImage || null,
      publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : rest.isPublished ? new Date() : null,
      projectMeta: projectMeta ?? Prisma.JsonNull,
      authorId,
      categories: categories?.length
        ? { connect: categories.map((id) => ({ id })) }
        : undefined,
      tags: tags?.length
        ? { connect: tags.map((id) => ({ id })) }
        : undefined,
    },
    include: POST_INCLUDE,
  });

  return post as PostWithRelations;
}

// ─── Update ───────────────────────────────────────────────────────────────────
export async function updatePost(
  id: string,
  data: PostUpdateInput
): Promise<PostWithRelations> {
  const { categories, tags, projectMeta, ...rest } = data;

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...rest,
      featuredImage: rest.featuredImage || null,
      publishedAt: rest.publishedAt
        ? new Date(rest.publishedAt)
        : rest.isPublished
        ? new Date()
        : undefined,
      ...(projectMeta !== undefined && { projectMeta: projectMeta ?? Prisma.JsonNull }),
      ...(categories !== undefined && {
        categories: {
          set: categories.map((catId) => ({ id: catId })),
        },
      }),
      ...(tags !== undefined && {
        tags: {
          set: tags.map((tagId) => ({ id: tagId })),
        },
      }),
    },
    include: POST_INCLUDE,
  });

  return post as PostWithRelations;
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deletePost(id: string): Promise<void> {
  await prisma.post.delete({ where: { id } });
}
