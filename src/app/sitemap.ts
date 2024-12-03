import { BASE_URL } from '@/lib/constants'
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
        url: `${BASE_URL}/gioi-thieu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
        url: `${BASE_URL}/du-an`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
        url: `${BASE_URL}/cac-dich-vu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
        url: `${BASE_URL}/cac-dich-vu/dich-vu-thiet-ke`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
        url: `${BASE_URL}/cac-dich-vu/thiet-ke-va-thi-cong-tron-goi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
        url: `${BASE_URL}/cac-dich-vu/dich-vu-giam-sat-thi-cong`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
        url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
        url: `${BASE_URL}/tuyen-dung`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
        url: `${BASE_URL}/du-an-noi-bat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
        url: `${BASE_URL}/du-an-da-hoan-thien`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}