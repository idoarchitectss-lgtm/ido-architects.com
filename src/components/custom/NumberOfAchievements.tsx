'use client'
import React from 'react'
import {motion} from 'framer-motion'



const archievementArr = [
    {
        title:"Số năm kinh nghiệm",
        number:9
    },
    {
        title:"Dự án đã triển khai",
        number:200,
    },
    {
        title:"Công trình thực tế hoàn thành",
        number:50,
    },{
        title:"Khách hàng hài lòng (%)",
        number:100,
    },
]

const NumberOfAchievements= (
) => {
  return (
    <motion.div 
    whileInView={{ opacity: 1 ,translateX:0}}
    initial={{ opacity: 0 ,translateX:100}} 
    viewport={{once:true}}
    transition={{duration:1}}
    className=' grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5 px-2 lg:px-10 w-[1000px] mx-auto text-white'>
        {
            archievementArr.map((item,index)=>(
                <div
                key={index}
                className='cursor-pointer hover:shadow-secondary/20 hover:shadow-md hover:border-2 duration-500 bg-neutral-100 text-secondary  text-xl font-[700] p-8 flex flex-col gap-3 items-center justify-center text-center shadow-xl'>
                <p className='uppercase text-primary '>{item.title}</p>
                <p className='text-3xl'>{item.number}</p>
            </div>
            ))
        }
        
    </motion.div>
  )
}

export default NumberOfAchievements