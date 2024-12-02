'use client'
import React from 'react'
import Title from '../title'
import ValueItem from './ValueItem'
import {motion} from 'framer-motion'

const valueItems = [
  {
    icon:'/image/ourvalues1.png',
    title:'Lắng nghe',
    text:'Lắng nghe những chia sẻ và yêu cầu của gia chủ một cách tỉ mỉ.'
  },
  {
    icon:'/image/ourvalues2.png',
    title:'Thấu hiểu',
    text:'Thấu hiểu từng mong muốn nguyện vọng bằng tất cả tâm tư tình cảm.'
  },
  {
    icon:'/image/ourvalues3.png',
    title:'Chuyên nghiệp',
    text:'Tạo quy trình phục vụ chuyên nghiệp tăng trải nghiệm của khách hàng'
  },
]

const ValuesComponent = () => {
  return (
    <div className='text-center h-[900px] flex flex-col justify-center items-center bg-neutral-100'>
      <Title 
      subtitle='OUR VALUES'
      title='Các giá trị cốt lõi'
      islightBg
      />
      <motion.div 
      whileInView={{ opacity: 1 ,translateY:0}}
      initial={{ opacity: 0 ,translateY:100}} 
      viewport={{once:true}}
      transition={{duration:2}}
      className='grid grid-cols-1 lg:grid-cols-3 mx-auto'>
        {valueItems.map(item=>(

        <ValueItem 
        key={item.title}
        icon={item.icon}
        title={item.title}
        text={item.text}
        classNames={item.title === 'Thấu hiểu' ? 'md:border-neutral-300 md:border-x-[1px]' : 'border-none'}
        />
        ))}
      </motion.div>
    </div>
  )
}

export default ValuesComponent