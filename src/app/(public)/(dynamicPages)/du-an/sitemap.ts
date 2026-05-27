import { getPublishedSlugsByType } from "@/features/posts/services/post.service";
import { PostType } from "@generated/prisma/client";
import { BASE_URL } from '@/lib/constants'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        const slugs = await getPublishedSlugsByType(PostType.PROJECT_POST);
        return slugs.map((slug) => ({
            url: `${BASE_URL}/du-an/${slug}`,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch {
        return [];
    }
}