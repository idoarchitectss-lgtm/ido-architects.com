'use client'
import React from 'react'
import Container from '@/components/custom/container'
import { Building } from 'lucide-react'
import Image from 'next/image'
import MainButton from '../mainButton'
import Title from '../title'

import {motion } from "framer-motion";

const valueOfCompany = [
    "Hoạt động với nhiều năm kinh nghiệm",
    "Thành công với nhiều dự án lớn",
    "Dự toán chính xác, giảm chi phí phát sinh"
]

const Team = () => {
    return (
        <section>
            <div className='my-24'>
                <Container>
                    <motion.div
                    initial={{scale:0.2, opacity:0}}
                    whileInView={{scale:1, opacity:1}}
                    viewport={{ once: true }}
                    transition={
                      {
                        duration:3.5,
                        delay:0.5,
                        staggerChildren:0.5,
                        
                        type:"spring",
                        ease:[0.6, 0.01, -0.05, 0.9]
                      }
                    }
                    className='flex flex-col lg:flex-row justify-start items-start gap-5 md:gap-10'>
                        <div className='flex-1 w-full'>
                            <div className='w-12/12 mb-5 '>
                                <div className='flex flex-col justify-center items-start md:items-center w-12/12 md:w-9/12 mx-auto gap-5'>
                                    <Title 
                                    title='Đội ngũ nhân sự nhiều năm kinh nghiệm'
                                    subtitle='Team'
                                    islightBg
                                    />
                                    {/* <div className='flex flex-col justify-start items-start'>
                                        <p className={`text-secondary text-left md:text-left text-sm font-[700] leading-[16px] border-l-[2px] border-secondary inline-block pl-2 py-1 `}>
                                            Team
                                        </p>
                                        <h2 className={`text-primary text-left text-[32px] font-[600] leading-[51px]`}>
                                            Đội ngũ nhân sự nhiều năm kinh nghiệm
                                        </h2>
                                    </div> */}
                                    {/* valuses content*/}
                                    <div className={` text-neutral-500 text-left font-[600] text-md leading-[32px] `}>
                                        <ul className='flex flex-col justify-start items-start gap-3'>
                                            {valueOfCompany?.map((value, index) => (
                                                <div
                                                    key={index}
                                                    className='flex flex-row items-center justify-center gap-3'>
                                                    <Building className='text-secondary' />
                                                    <li>
                                                        {value}
                                                    </li>
                                                </div>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* call to action */}
                                    <div className=' flex flex-col justify-start items-center w-full md:w-[400px]'>
                                        <MainButton
                                            className='w-[70%]  lg:w-[50%] xl:w-[45%] 2xl:w-[45%] shadow-lg'
                                            slug='/contact'
                                            label='LIÊN HỆ'
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className='flex-1 w-full h-[500px]'>
                            <Image
                                src="https://images.pexels.com/photos/5582597/pexels-photo-5582597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt='team'
                                height={800}
                                width={1200}
                                className='object-cover w-full h-full'
                            />
                        </div>
                    </motion.div>
                </Container>

            </div>
        </section>
    )
}

export default Team