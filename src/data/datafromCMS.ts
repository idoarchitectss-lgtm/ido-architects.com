/**
 * datafromCMS.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Data fetching layer cho PUBLIC pages.
 *
 * ✅ Rule (docs/refactor-cms/04-DATA-LAYER.md):
 *   "Mọi data fetching đều phải đi qua API Route"
 *   Không gọi Prisma / service trực tiếp từ Server Component.
 *
 * Luồng:
 *   Server Component → fetch('/api/posts?...') → API Route → Prisma → response
 *
 * Caching:
 *   - projects list : tag "projects",  revalidate 120s
 *   - post detail   : tag "post-slug-${slug}", revalidate 120s
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { PostResponse, PostListResponse } from "@/features/posts/types/post.types";
import type {
  portfolios,
  porfolioCategory,
  NodeProps,
  PostsProps,
  ServicesNodeArr,
} from "@/types/typeForWordpressData";
import type { ProjectMeta } from "@/features/posts/types/post.types";
import type { ServiceResponse, ServiceListResponse } from "@/features/company-services/types/service.types";
import {
  serviceListToNodeArr,
  serviceResponseToNodeItem,
} from "@/features/company-services/transforms/service.transform";
import { DEFAULT_IMG } from "@/lib/constants";

// ─── Resolve base URL (Server Component chạy trong Node.js cần URL tuyệt đối) ─
function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// ─── Transform PostResponse → portfolios shape (UI đang dùng) ─────────────────
function toPortfolioShape(post: PostResponse): portfolios {
  const meta = (post.projectMeta ?? {}) as ProjectMeta;
  return {
    slug: post.slug,
    title: post.title,
    featuredImage: {
      node: {
        sourceUrl: post.featuredImage ?? DEFAULT_IMG,
      },
    },
    content: post.content ?? "",
    excerpt: post.excerpt ?? "",
    date: post.publishedAt ?? post.createdAt,
    galleryImages: Array.isArray(meta.galleryImages) ? meta.galleryImages : [],
    project: {
      descriptionOfProject: post.excerpt ?? "",
      nameOfProject: meta.nameOfProject ?? post.title,
      generalInformation: {
        completedYear: meta.completedYear ?? "",
        floorDimension: meta.floorDimension ?? 0,
        numberOfFloors: meta.numberOfFloors ?? 0,
        propertyType: meta.propertyType ?? "Công trình",
        addressOfProperty: meta.addressOfProperty ?? "",
        designedCompany: meta.designedCompany ?? "IDO Architects",
        mapEmbedUrl: meta.mapEmbedUrl,
      },
      isCompleted: meta.isCompleted ?? false,
      isFeatured: meta.isFeatured ?? false,
    },
    portfolioCategories: {
      nodes: post.categories?.[0]
        ? { name: post.categories[0].name, slug: post.categories[0].slug }
        : { name: "Dự án", slug: "du-an" },
    },
  };
}

// ─── Fetch helper ─────────────────────────────────────────────────────────────
async function fetchProjects(params: Record<string, string> = {}): Promise<PostResponse[]> {
  const qs = new URLSearchParams({
    type: "PROJECT_POST",
    size: "100",
    ...params,
  });

  const res = await fetch(`${getBaseUrl()}/api/posts?${qs}`, {
    next: { tags: ["projects"], revalidate: 120 },
  });

  if (!res.ok) return [];
  const data: PostListResponse = await res.json();
  return data.posts ?? [];
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Trả về tất cả PROJECT_POST */
export async function allProjectsFromCMS(): Promise<{
  portfoliosArray: portfolios[];
  featuredPortfolios: portfolios[];
  completedPortfolios: portfolios[];
}> {
  const posts = await fetchProjects();
  const portfoliosArray = posts.map(toPortfolioShape);
  return {
    portfoliosArray,
    featuredPortfolios: portfoliosArray.filter((p) => p.project.isFeatured),
    completedPortfolios: portfoliosArray.filter((p) => p.project.isCompleted),
  };
}

/** Trích propertyType thành danh sách categories */
export async function allProjectCategoriesFromCMS(): Promise<porfolioCategory[]> {
  const posts = await fetchProjects();
  const seen = new Set<string>();
  const categories: porfolioCategory[] = [];
  for (const post of posts) {
    const type = (post.projectMeta as ProjectMeta | null)?.propertyType;
    if (type && !seen.has(type)) {
      seen.add(type);
      categories.push({ name: type, slug: type.toLowerCase().replace(/\s+/g, "-") });
    }
  }
  return categories;
}

/** GET /api/posts/slug/[slug] → trả về single project */
export async function getSingleProjectFromCMS(
  slug: string
): Promise<{ portfolio: portfolios } | null> {
  const res = await fetch(`${getBaseUrl()}/api/posts/slug/${slug}`, {
    next: { tags: [`post-slug-${slug}`], revalidate: 120 },
  });

  if (!res.ok) return null;
  const post: PostResponse = await res.json();
  if (post.type !== "PROJECT_POST") return null;
  return { portfolio: toPortfolioShape(post) };
}

/** Lấy tất cả slug cho generateStaticParams */
export async function allProjectSlugsFromCMS(): Promise<string[]> {
  const posts = await fetchProjects();
  return posts.map((p) => p.slug);
}

// ─── Blog (BLOG_POST) helpers ─────────────────────────────────────────────────

/** Transform PostResponse → NodeProps shape */
function toBlogShape(post: PostResponse): NodeProps {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    date: post.publishedAt ?? post.createdAt,
    uri: `/blog/${post.slug}`,
    featuredImage: {
      node: {
        sourceUrl:
          post.featuredImage ??
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
        altText: post.title,
        title: post.title,
      },
    },
    author: {
      node: {
        name: post.author?.name ?? "IDO Architects",
        firstName: "",
        lastName: "",
        description: null,
        avatar: { url: "" },
      },
    },
    categories: {
      nodes: post.categories?.map((c) => ({ name: c.name, slug: c.slug })) ?? [],
    },
    tags: {
      nodes: post.tags?.map((t) => ({ name: t.name, slug: t.slug })) ?? [],
    },
  };
}

/** Fetch helper cho BLOG_POST */
async function fetchBlogs(params: Record<string, string> = {}): Promise<PostResponse[]> {
  const qs = new URLSearchParams({ type: "BLOG_POST", size: "100", ...params });
  const res = await fetch(`${getBaseUrl()}/api/posts?${qs}`, {
    next: { tags: ["blogs"], revalidate: 120 },
  });
  if (!res.ok) return [];
  const data: PostListResponse = await res.json();
  return data.posts ?? [];
}

/** Fetch helper cho BLOG_POST */
export async function allBlogsFromCMS(
  size = 10,
  page = 1,
  categoryId?: string
): Promise<PostsProps> {
  const qs = new URLSearchParams({
    type: "BLOG_POST",
    size: String(size),
    page: String(page),
  });
  if (categoryId) {
    qs.append("categoryId", categoryId);
  }
  const res = await fetch(`${getBaseUrl()}/api/posts?${qs}`, {
    next: { tags: ["blogs"], revalidate: 120 },
  });
  if (!res.ok)
    return { edges: [], pageInfo: { offsetPagination: { total: 0, hasMore: false, hasPrevious: false } } };

  const data: PostListResponse = await res.json();
  const posts = data.posts ?? [];
  const { total, hasMore, hasPrevious } = data.pageInfo ?? {};

  return {
    edges: posts.map((p) => ({ node: toBlogShape(p) })),
    pageInfo: {
      offsetPagination: {
        total: total ?? posts.length,
        hasMore: hasMore ?? false,
        hasPrevious: hasPrevious ?? false,
      },
    },
  };
}

/** GET /api/posts/slug/[slug] → trả về single blog post */
export async function getSingleBlogFromCMS(slug: string): Promise<NodeProps | null> {
  const res = await fetch(`${getBaseUrl()}/api/posts/slug/${slug}`, {
    next: { tags: [`post-slug-${slug}`], revalidate: 120 },
  });
  if (!res.ok) return null;
  const post: PostResponse = await res.json();
  if (post.type !== "BLOG_POST") return null;
  return toBlogShape(post);
}

/** Lấy tất cả slug blog cho generateStaticParams */
export async function allBlogSlugsFromCMS(): Promise<string[]> {
  const posts = await fetchBlogs();
  return posts.map((p) => p.slug);
}

// ─── Blog categories (Category model, type = BLOG_POST) ──────────────────────

export type BlogCategoryItem = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
};

/** GET /api/categories?type=BLOG_POST → danh mục dùng cho trang blog */
export async function allBlogCategoriesFromCMS(): Promise<BlogCategoryItem[]> {
  const res = await fetch(`${getBaseUrl()}/api/categories?type=BLOG_POST`, {
    next: { tags: ["categories"], revalidate: 120 },
  });
  if (!res.ok) return [];
  const data: Array<{ id: string; name: string; slug: string; image: string | null }> =
    await res.json();
  return data.map((c) => ({ id: c.id, name: c.name, slug: c.slug, image: c.image }));
}

// ─── Company Services ─────────────────────────────────────────────────────────

/** GET /api/services?showAll=false&size=100 → ServicesNodeArr (published only) */
export async function allServicesFromCMS(): Promise<ServicesNodeArr> {
  const res = await fetch(
    `${getBaseUrl()}/api/services?showAll=false&size=100`,
    { next: { revalidate: 120, tags: ["services"] } }
  );
  if (!res.ok) return [];
  const data: ServiceListResponse = await res.json();
  return serviceListToNodeArr(data.services ?? []);
}

/** GET /api/services/slug/[slug] → single ServiceResponse or null */
export async function singleServiceFromCMS(
  slug: string
): Promise<ServiceResponse | null> {
  const res = await fetch(`${getBaseUrl()}/api/services/slug/${slug}`, {
    next: { revalidate: 120, tags: [`service-slug-${slug}`] },
  });
  if (!res.ok) return null;
  return res.json() as Promise<ServiceResponse>;
}

/** Lấy tất cả slug services cho generateStaticParams */
export async function allServiceSlugsFromCMS(): Promise<string[]> {
  const res = await fetch(
    `${getBaseUrl()}/api/services?showAll=false&size=100`,
    { next: { revalidate: 120, tags: ["services"] } }
  );
  if (!res.ok) return [];
  const data: ServiceListResponse = await res.json();
  return (data.services ?? []).map((s) => s.slug);
}

