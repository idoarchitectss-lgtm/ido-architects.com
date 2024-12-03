import { allPortfolios } from '@/data/datafromWP';
import { BASE_URL } from '@/lib/constants'
import { MetadataRoute } from 'next'
 

export default async function sitemap({slug}:{slug:string}):Promise<MetadataRoute.Sitemap> {
    const res = await allPortfolios();
    const portfolios = res.portfoliosArray
    return portfolios.map((project)=>({
        url:`${BASE_URL}/du-an/${project.slug}`,
        lastModified:project.date,
        changeFrequency:'weekly',
        priority:0.8,
    }))
}