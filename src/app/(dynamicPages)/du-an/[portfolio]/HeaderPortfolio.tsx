'use client'

import ContactForm from '@/components/custom/forms/ContactForm'
import { ShareLinkComponent } from '@/components/custom/ShareLinkComponent'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { portfolios } from '@/types/typeForWordpressData'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface HeaderPortfolioProps {
  portfolio: portfolios
}

const HeaderPortfolio: React.FC<HeaderPortfolioProps> = ({ portfolio }) => {
  const pathname = usePathname()
  return (
    <>
      <div className="relative h-[250px] rounded-xl overflow-hidden"
        style={{
          backgroundImage: `url(${portfolio?.featuredImage?.node.sourceUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='absolute top-0 left-0 bg-transparent/25 w-full h-full'>
        </div>
        <Link href={pathname || "/"}>
          <div
            className=' absolute text-2xl z-10 text-white mt-10 mx-5 font-semibold'
            dangerouslySetInnerHTML={{ __html: portfolio?.title }}>

          </div>
        </Link>
      </div>
      
    </>
  )
}

export default HeaderPortfolio