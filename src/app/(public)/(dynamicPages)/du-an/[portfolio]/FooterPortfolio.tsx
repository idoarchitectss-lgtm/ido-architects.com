'use client'
import { portfolios } from '@/types/typeForWordpressData'
import { Building, ChevronRight, Circle } from 'lucide-react'
import Image from 'next/image'
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
       <ul className='bg-secondary/10 border-[1px] border-neutral-300 px-2 py-0 underline-offset-1'>
        {
          portfolioArrSlice?.map((item)=> (
                <Link key={item.slug} href={item.slug}
                className='hover:text-secondary font-normal duration-300 flex flex-row justify-start items-center gap-2 mt-2 border-netrual-300 border-b-[1px]'
                >
                <div className='flex-none w-[100px] h-[80px] overflow-hidden flex justify-center items-center'>
                <Image 
                src={item.featuredImage?.node?.sourceUrl}
                alt={item.title}
                width={500}
                height={500}
                className='w-full h-full rounded-sm object-cover'
                />
                </div>
                <li className='px-5 text-primary text-base hover:underline hover:text-secondary line-clamp-3 duration-300'>{item.title}</li>
                </Link>
            ))
          }
          </ul>
    </div>
  )
}

export default FooterPortfolio