import Container from '@/components/custom/container'
import { BASE_URL } from '@/lib/constants'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <Container className='h-[60vh]'>
        <h1 className='text-2xl py-3 mt-10
        '>Sitemap</h1>
        <div className='flex flex-col'>
        <Link 
        className='underline hover:text-secondary'
        href={`${BASE_URL}/sitemap.xml`}>
        {BASE_URL}/sitemap.xml
        </Link>
        <Link
        className='underline hover:text-secondary'
        href={`${BASE_URL}/du-an/sitemap.xml`}>
        {BASE_URL}/du-an/sitemap.xml</Link>
        <Link 
        className='underline hover:text-secondary'
        href={`${BASE_URL}/blog/sitemap.xml`}>
        {BASE_URL}/blog/sitemap.xml
        </Link>
        </div>
    </Container>
  )
}

export default page