'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


const ItemMenu = [
  {
    name: "Trang chủ",
    slug: '/'
  },
  {
    name: "Giới thiệu",
    slug: '/about-us'
  },
  {
    name: "Dự án",
    slug: '/portfolios',
    subMenu: [
      {
        name: "Nhà Phố",
        slug: '/portfolios'
      },
      {
        name: "Biệt Thự Villa",
        slug: '/portfolios'
      },
      {
        name: "Căn hộ, Chung Cư",
        slug: '/portfolios'
      },
      {
        name: "Tòa Nhà Văn Phòng",
        slug: '/portfolios'
      },
      {
        name: "Khách Sạn",
        slug: '/portfolios'
      },
      {
        name: "Cafe, Spa",
        slug: '/portfolios'
      }

    ]
  },
  {
    name: "Các dịch vụ",
    slug: '/our-services',
    subMenu: [
      {
        name: "Dịch Vụ Thiết Kế",
        slug: '/our-services'
      },
      {
        name: "Dịch Vụ Thi Công",
        slug: '/our-services'
      },
      {
        name: "Dịch Vụ Tư Vấn",
        slug: '/our-services'
      },
    ]
  },
  {
    name: "Tin tức",
    slug: '/blog'
  },
  {
    name: "Liên hệ",
    slug: "/contact"
  },
]



const Navbar = () => {
  return (
    <div className='hidden lg:block '>
      <div className='flex flex-row items-center justify-start gap-8'>
        {
          ItemMenu.map((item, index) => (
            <>
          <HoverCard openDelay={200} closeDelay={200}>
            <HoverCardTrigger key={index} 
            href={item.slug}
            className='font-[500] text-md hover:text-secondary duration-300'>
              <p>
              {item.name}
              </p>
            </HoverCardTrigger>

            {item.subMenu && (  
            <HoverCardContent className='bg-neutral-100 dark:bg-black flex flex-col gap-4 text-black dark:text-white mt-7'>
            {item.subMenu?.map((subItem,index)=>(
              <Link key={index}
              className='text-md font-semibold hover:text-secondary duration-300 '
              href={subItem.slug}
              >
                {subItem.name}
              </Link>
            ))}
            </HoverCardContent>
            )}
          </HoverCard>
            </>

          ))
        }
      </div>
    </div>
  )
}

export default Navbar;

