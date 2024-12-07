'use client'

import React, { useEffect, useRef } from 'react'
import styles from './footer.module.css'
import Link from 'next/link'
import Container from '@/components/custom/container'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, ChevronRight, Facebook, Instagram, Linkedin, LocateIcon, Mail, Map, Phone, PlayCircle, Youtube } from 'lucide-react'
import { usePathname } from 'next/navigation'
import FacebookPageEmbed from '../embed/FacebookPageEmbed'


const footerItem = [
  {
    title: "Trang chủ",
    slug: ""
  },
  {
    title: "Các dự án",
    slug: "du-an"
  },
  {
    title: "Các dịch vụ",
    slug: "cac-dich-vu"
  },
  {
    title: "Liên hệ",
    slug: "lien-he"
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

const infoItems = [
  {
    icon: <Building2 />,
    text: "Tầng 6 ,Danabook , 78 Bạch Đằng, Đà Nẵng",
    href: "https://maps.app.goo.gl/muDjEQtkFAPLLBct7",
  },
  {
    icon: <Mail />,
    text: "hoang@ido-architects.com",
    href: "mailto:hoang@ido-architects.com",
  },
  {
    icon: <Phone />,
    text: "+84 097 426 5929",
    href: "tel:0974265929",
  }
]

const Footer = () => {
  const pathname = usePathname();
  const segments = pathname.split('/')
  // useEffect(()=>{
  //   console.log(segments)
  // },[segments])

  return (
    <footer className='bg-[#222222] text-white pt-20'>
      <Container>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7 py-3 px-2 md:px-10'>
          {/* col-1 */}
          <div className='flex flex-col  justify-start items-start md:items-start gap-5 col-span-2 py-4 w-full md:w-10/12'>
            <Link href="/">
              <h2 className='text-2xl font-semibold'>
              CÔNG TY TNHH THIẾT KẾ VÀ XÂY DỰNG IDO ARCHITECTS
              </h2>
            </Link>
            {/* <p className='text-base text-left  line-clamp-3'>DO Architect là đơn vị hàng đầu trong lĩnh vực thiết kế kiến trúc và nội thất. Với đội ngũ kiến trúc sư tài năng, giàu kinh nghiệm, chúng tôi cam kết mang đến những giải pháp thiết kế sáng tạo,</p> */}
            <div className='flex flex-col items-start gap-1 col-span-4 md:col-span-1 mt-1 text-center md:text-left text-base'>
              {/* <h3 className='text-xl font-semibold'></h3> */}
              <div className='gap-3 flex flex-col items-start pl-5 mt-2'>
                {infoItems.map((item, index) => (
                  <div
                    key={index}
                    className='flex flex-row gap-1 justify-start items-center w-full group'>
                    <div className='w-10 h-10 flex items-center justify-center border-secondary border-[1px] rounded-full group-hover:bg-secondary group-hover:text-white duration-500'>
                      {item.icon}
                    </div>
                    <Link
                      href={item.href}
                      className='group-hover:text-secondary duration-500 text-left'>{item.text}
                    </Link>
                  </div>
                ))}
              </div>
            </div>


          </div>
          {/* col-2 */}
          <div className='col-span-2 md:col-span-1 mt-3 text-left '>
            <h3 className='text-xl font-semibold'>Menu</h3>
            {footerItem && footerItem.map((item, index) => (
              <Link
                key={index} href={`${segments[0]}/${item.slug}`}
                className='block border-b-[1px] border-white/10 mt-2'
              >
                <p className='text-base  hover:text-[#F57542] py-1'>{item.title}</p>
              </Link>
            ))}
          </div>
          {/* col-3 */}
          <div className='col-span-1 w-full overflow-hidden'>
            <div className='w-full'>
              <h3 className='font-[700] text-lg'>Theo dõi chúng tôi</h3>
              <FacebookPageEmbed />
            </div>
            <div className='flex flex-row gap-3 cursor-pointer mt-5'>
              <Link href="https://www.facebook.com/ido.architectss">
                <Facebook className='hover:text-[#F57542]' />
              </Link>
              <Instagram className='hover:text-[#F57542]' />
              <Youtube className='hover:text-[#F57542]' />
              <Linkedin className='hover:text-[#F57542]' />
            </div>
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