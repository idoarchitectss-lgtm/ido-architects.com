'use client'
import React, { useEffect, useRef } from 'react'
import Container from '../container'
import Title from '../title'
import ServiceCarousel from './ServiceCarousel'
import { ServicesNodeArr } from '@/types/typeForWordpressData'

import {motion} from "framer-motion"

interface OfferServicesProps {
  servicesArr:ServicesNodeArr
}

const OfferServices:React.FC<OfferServicesProps> = ({
  servicesArr,
}) => {


  return (
    <section className='relative h-[600px]'>
      <div className='my-16 h-full'>
        <div className='overflow-hidden h-full w-full'>
          <div
          className='h-full flex flex-col items-center justify-between gap-10'>
            <Title
              title='Các dịch vụ mà chúng tôi cung cấp'
              subtitle='OUR SERVICES'
              text='IDO Architect là đơn vị hàng đầu trong lĩnh vực thiết kế kiến trúc và nội thất. Với đội ngũ kiến trúc sư tài năng, giàu kinh nghiệm, chúng tôi cam kết mang đến những giải pháp thiết kế sáng tạo, tối ưu hóa công năng sử dụng và phù hợp với phong cách sống của từng khách hàng'
              islightBg
            />
            {/* carousel Services */}
           <ServiceCarousel 
           servicesArr={servicesArr}
           />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OfferServices