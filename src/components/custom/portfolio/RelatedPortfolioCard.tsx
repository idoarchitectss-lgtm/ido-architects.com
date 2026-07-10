import { portfolios } from '@/types/typeForWordpressData'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface RelatedPortfolioCardProps {
  portfolio: portfolios
}

const RelatedPortfolioCard: React.FC<RelatedPortfolioCardProps> = ({ portfolio }) => {
  return (
    <Link href={portfolio.slug} className='group'>
      <Card className='overflow-hidden border-neutral-200 hover:shadow-md transition-shadow duration-300'>
        <div className='relative aspect-[4/3] w-full'>
          <Image
            src={portfolio.featuredImage?.node?.sourceUrl}
            alt={portfolio.title}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-500'
            sizes='(max-width: 768px) 50vw, 20vw'
          />
        </div>
        <CardHeader className='p-3'>
          <CardTitle className='text-sm md:text-base font-semibold text-primary group-hover:text-secondary line-clamp-2 duration-300'>
            {portfolio.title}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  )
}

export default RelatedPortfolioCard
