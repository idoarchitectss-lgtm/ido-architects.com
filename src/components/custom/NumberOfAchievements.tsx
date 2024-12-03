'use client'
import React from 'react'
import {motion} from 'framer-motion'
import NumberCounter from './NumberCounter'



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
            <NumberCounter 
            key={index}
            title={item.title}
            from={0}
            to={item.number}
            />
            ))
        }
        
    </motion.div>
  )
}

export default NumberOfAchievements