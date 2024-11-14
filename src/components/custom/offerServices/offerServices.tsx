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
    <section>
      <div className='my-16'>
        <Container className='overflow-hidden'>
          <motion.div
          initial={{ opacity: 0,  translateX:-300}}
          whileInView={{ opacity: 1,  translateX: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.5 ,
            delay: 1.5
          }}
          className=''>
            <Title
              title='Các dịch vụ tốt nhất tại IDO Architect'
              subtitle='Chúng tôi cung cấp những gì'
              text='IDO Architect là đơn vị hàng đầu trong lĩnh vực thiết kế kiến trúc và nội thất. Với đội ngũ kiến trúc sư tài năng, giàu kinh nghiệm, chúng tôi cam kết mang đến những giải pháp thiết kế sáng tạo, tối ưu hóa công năng sử dụng và phù hợp với phong cách sống của từng khách hàng'
              islightBg
            />
            {/* carousel Services */}
           <ServiceCarousel 
           servicesArr={servicesArr}
           />
          </motion.div>
        </Container>
      </div>
    </section>
  )
}

export default OfferServices