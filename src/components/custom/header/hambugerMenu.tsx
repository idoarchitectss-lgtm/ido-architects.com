'use client'
import React, { useState } from 'react'
import {Menu} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import Link from 'next/link'
import SocialInfo from './socialInfo'



const mobileNavBarItem = [
  {
    name: "Về Ido Architect",
    slug:'/'
  },
  {
    name: "Portfolios",
    slug:'/portfolios'
  },
  {
    name:"Các dịch vụ",
    slug:"/our-services"

  },
  {
    name: "Blog",
    slug: "/blog"
  },
  {
    name: "Liên hệ",
    slug: "/contact"
  },

]

const HambugerMenu = () => {

const [isOpen, setIsOpen] = useState<boolean>(false)
const handleClick = ()=> {
  setIsOpen(false)
  console.log(isOpen)
}
  return (
    <>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className=''>
              <Menu className=' hover:text-secondary hover:-translate-y-2 duration-300' size={30}/>
            </DialogTrigger>
            <DialogContent className=' h-[50vh] flex justify-center items-center border-none'>
              <div className='flex flex-col gap-5'>
              <ul className='flex flex-col justify-center items-center gap-10 text-2xl font-[700]'>
               {mobileNavBarItem.map((item,index)=>(
                <Link
                onClick={handleClick}
                key={index} 
                href={item.slug} >
                  <li className=' text-secondary hover:scale-110 duration-300'>{item.name}</li>
                </Link>
               ))}
              </ul>
              <SocialInfo 
              isHorizontal
              classNames="bg-transparent text-secondary"
              />
              </div>
            </DialogContent>
          </Dialog>

    </>

  )
}

export default HambugerMenu