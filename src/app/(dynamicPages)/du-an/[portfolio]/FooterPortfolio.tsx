'use client'
import { portfolios } from '@/types/typeForWordpressData'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface FooterPortfolioProps {
portfolioArr: portfolios[]
}

const FooterPortfolio: React.FC<FooterPortfolioProps> = ({
    portfolioArr
}) => {
  
  const pathname = usePathname()

  const segments = pathname.split('/').filter(Boolean)

  // console.log(segments[1])

  const portfolioArrSlice = portfolioArr?.slice(0,5).filter((item)=> item.slug !== segments[1])

  return (
    <div className='my-7'>
        <h2 className='text-3xl font-semibold my-2'>Xem thêm những dự án khác</h2>
       <ul className='bg-secondary/10 border-[1px] border-neutral-300 rounded-lg px-2 py-3 underline-offset-1'>
        {
          portfolioArrSlice?.map((item)=> (
                <Link key={item.slug} href={item.slug}
                className='hover:text-secondary font-normal duration-300'
                >
                <li>{item.title}</li>
                </Link>
            ))
          }
          </ul>
    </div>
  )
}

export default FooterPortfolio