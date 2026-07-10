'use client'
import { portfolios } from '@/types/typeForWordpressData'
import { usePathname } from 'next/navigation'
import React from 'react'
import RelatedPortfolioCard from '@/components/custom/portfolio/RelatedPortfolioCard'

interface FooterPortfolioProps {
  portfolioArr: portfolios[]
}

const FooterPortfolio: React.FC<FooterPortfolioProps> = ({
  portfolioArr
}) => {

  const pathname = usePathname()

  const segments = pathname.split('/').filter(Boolean)

  // console.log(segments[1])

  const portfolioArrSlice = portfolioArr?.slice(0, 3).filter((item) => item.slug !== segments[1])

  return (
    <div className='my-7 px-1'>
      <h2 className='text-xl md:text-3xl font-bold my-6'>Xem thêm những dự án khác</h2>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {
          portfolioArrSlice?.map((item) => (
            <RelatedPortfolioCard key={item.slug} portfolio={item} />
          ))
        }
      </div>
    </div>
  )
}

export default FooterPortfolio