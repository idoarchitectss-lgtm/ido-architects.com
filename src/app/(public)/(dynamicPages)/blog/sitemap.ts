import { allBlogSlugsFromCMS } from "@/data/datafromCMS";
import { BASE_URL } from "@/lib/constants";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const slugs = await allBlogSlugsFromCMS().catch(() => []);
    return slugs.map((slug) => ({
        url: `${BASE_URL}/blog/${slug}`,
        changeFrequency: "daily" as const,
        priority: 1,
    }));
}
