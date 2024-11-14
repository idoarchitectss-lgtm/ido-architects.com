'use client'

import React, { useEffect, useRef } from 'react'
import styles from './footer.module.css'
import Link from 'next/link'
import Container from '@/components/custom/container'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight, Facebook, Instagram, Linkedin, LocateIcon, Mail, Map, Phone, Youtube } from 'lucide-react'
import { usePathname } from 'next/navigation'


const footerItem = [
  {
    title: "Trang chủ",
    slug: ""
  },
  {
    title: "Các dự án",
    slug: "portfolios"
  },
  {
    title: "Các dịch vụ",
    slug: "our-services"
  },
  {
    title: "Liên hệ",
    slug: "contact"
  },
  {
    title: "Blog",
    slug: "blog"
  },
  {
    title: "Sitemap",
    slug: "sitemap"
  },

]
const Footer = () => {
  const pathname = usePathname();
  const segments= pathname.split('/')
  // useEffect(()=>{
  //   console.log(segments)
  // },[segments])

  return (
    <footer className='bg-primary dark:bg-neutral-900 text-white py-5'>
      <Container>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 py-3'>
          <div className='flex flex-col  justify-start items-start md:items-start gap-5 col-span-2 py-4 w-full md:w-10/12'>
            <Link href="/">
              <h2 className='text-3xl font-bold'><span className='text-secondary'>IDO</span> ARCHITECT</h2>
            </Link>
            <p className='text-base text-left  line-clamp-3'>DO Architect là đơn vị hàng đầu trong lĩnh vực thiết kế kiến trúc và nội thất. Với đội ngũ kiến trúc sư tài năng, giàu kinh nghiệm, chúng tôi cam kết mang đến những giải pháp thiết kế sáng tạo,</p>
            <div className='flex flex-col items-start gap-1 col-span-4 md:col-span-1 mt-3 text-center md:text-left text-base'>
              <h3 className='text-xl font-semibold'>Trụ sở chính</h3>
              <div className='gap-3 flex flex-col items-start'>
                <div className='flex flex-row gap-1 justify-center items-center'>
                  <Map size={15} className='w-5 h-5'/>
                  <p className=' text-left'>Tầng 6 ,Toà nhà Danabook , 78 Bạch Đằng , Quận Hải Châu ,Da Nang, Vietnam</p>
                </div>
                <div className='flex flex-row gap-1 justify-center items-center'>
                  <Mail className=' w-5 h-5'/>
                  <p className=''>hoang@ido-architects.com</p>
                </div>
                <div className='flex flex-row justify-center items-center gap-1'>
                  <Phone />
                  <Link
                    href="tel:+840974265929"
                    className='font-medium text-sm'>+84 097 426 5929</Link>
                </div>
              </div>
            </div>

            <div className='flex flex-row gap-3 cursor-pointer '>
              <Link href="https://www.facebook.com/ido.architectss">
              <Facebook className='hover:text-[#F57542]' />
              </Link>
              <Instagram className='hover:text-[#F57542]' />
              <Youtube className='hover:text-[#F57542]' />
              <Linkedin className='hover:text-[#F57542]' />
            </div>
          </div>

          <div className='col-span-2 md:col-span-1 mt-3 text-left '>
            <h3 className='text-xl font-semibold'>Menu</h3>
            {footerItem && footerItem.map((item, index) => (
              <Link key={index} href={`${segments[0]}/${item.slug}`}>
                <p className='text-base  hover:text-[#F57542] py-1'>{item.title}</p>
              </Link>
            ))}
          </div>
          
        </div>

      </Container>
      <hr />
      <div className='flex justify-center items-end  '>
        <span className=' my-2 text-sm'>Design by Lem</span>
      </div>
    </footer>

  )
}

export default Footer