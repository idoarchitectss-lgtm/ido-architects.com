import { BASE_URL } from '@/lib/constants'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: '/lien-he/',
    },
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/du-an/sitemap.xml`,
      `${BASE_URL}/blog/sitemap.xml`
    ]

  }
}