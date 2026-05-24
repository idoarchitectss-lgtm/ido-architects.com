import type {
  PostWithRelations,
  PostResponse,
  PostListResponse,
  ProjectMeta,
} from "../types/post.types";

export function transformPost(post: PostWithRelations): PostResponse {
  return {
    id:            post.id,
    type:          post.type,
    title:         post.title,
    slug:          post.slug,
    excerpt:       post.excerpt,
    content:       post.content,
    featuredImage: post.featuredImage,
    publishedAt:   post.publishedAt?.toISOString() ?? null,
    isPublished:   post.isPublished,
    metaTitle:     post.metaTitle,
    metaDesc:      post.metaDesc,
    metaKeywords:  post.metaKeywords,
    projectMeta:   (post.projectMeta as ProjectMeta) ?? null,
    author:        { name: post.author.name },
    categories:    post.categories,
    tags:          post.tags,
    createdAt:     post.createdAt.toISOString(),
    updatedAt:     post.updatedAt.toISOString(),
  };
}

export function transformPostList(
  posts: PostWithRelations[],
  total: number,
  page: number,
  size: number
): PostListResponse {
  return {
    posts: posts.map(transformPost),
    pageInfo: {
      total,
      hasMore: (page - 1) * size + posts.length < total,
      hasPrevious: page > 1,
    },
  };
}
