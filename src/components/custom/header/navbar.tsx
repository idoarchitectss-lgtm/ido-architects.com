'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'


export const ItemMenu = [
  {
    name: "Trang chủ",
    slug: '/'
  },
  {
    name: "Về Ido Architects",
    slug: '/gioi-thieu'
  },
  {
    name: "Dự án",
    slug: '/du-an',
    subMenu: [
      {
        name: "Dự án nổi bật",
        slug: '/du-an-noi-bat'
      },
      {
        name: "Dự án đã hoàn thiện",
        slug: '/du-an-da-hoan-thien'
      },
    ]
  },
  {
    name: "Các dịch vụ",
    slug: '/cac-dich-vu',
    subMenu: [
      {
        name: "Dịch Vụ Thiết Kế",
        slug: '/dich-vu-thiet-ke'
      },
      {
        name: "Dịch Vụ Thi Công",
        slug: '/thiet-ke-va-thi-cong-tron-goi'
      },
      {
        name: "Dịch Vụ Tư Vấn Giám Sát",
        slug: '/dich-vu-giam-sat-thi-cong'
      },
    ]
  },
  {
    name: "Kiến thức",
    slug: '/blog'
  },
  {
    name: "Tuyển dụng",
    slug: '/tuyen-dung'
  },
  // {
  //   name: "Liên hệ",
  //   slug: "/lien-he"
  // },
]


const Navbar = () => {
  const [selectedItem,setSelectedItem] = useState<string>('/');
  const pathname = usePathname();
  
  useEffect(()=>{
    setSelectedItem(pathname)
  },[pathname,])


  return (
    <div className='hidden lg:block mr-10'>
      <div className='flex flex-row items-center justify-start gap-8'>
        {
          ItemMenu.map((item, index) => (
            <>
          <HoverCard openDelay={200} closeDelay={200}>
            <HoverCardTrigger key={index} 
            href={item.slug}
            className={`font-[400] text-md hover:text-secondary duration-300 flex flex-row items-center justify-center py-2
              ${selectedItem === item.slug ? 'border-white border-b-2 text-secondary font-bold': ''}
            `}>
              <p
              className={`  `}
              >
              {item.name}
              </p>
              {item.subMenu && <ChevronDown className='h-5 w-5'/>}
            </HoverCardTrigger>

            {item.subMenu && (  
            <HoverCardContent className='bg-neutral-100 dark:bg-black flex flex-col gap-4 text-black dark:text-white mt-7'>
            {item.subMenu?.map((subItem,index)=>(
              <Link key={index}
              className='text-md text-neutral-500 font-normal hover:text-secondary duration-300 border-b-[1px] border-neutral-300 pb-2'
              href={item.slug === '/du-an' ? subItem.slug : item.slug + subItem.slug}
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

