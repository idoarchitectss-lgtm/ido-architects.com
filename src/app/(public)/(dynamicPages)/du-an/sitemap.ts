import { allProjectsFromCMS } from '@/data/datafromCMS';
import { BASE_URL } from '@/lib/constants'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const res = await allProjectsFromCMS();
    const portfolios = res.portfoliosArray || [];
    return portfolios.map((project) => ({
        url: `${BASE_URL}/du-an/${project.slug}`,
        lastModified: project.date,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));
}