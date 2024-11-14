'use client'

import React, { useEffect } from 'react'
import MainButton from '../mainButton'
import { Play } from 'lucide-react'
import Link from 'next/link'

import { motion } from "framer-motion";

const Media = () => {

    const text= "Chúng tôi cam kết mang đến những giá trị tốt nhất cho cho các dự án"
    const letters = text.split('');
    return (
        <section className='relative h-[100vh] md:h-[70vh] lg:h-[70vh] xl:h-[65vh] 2xl:h-[70vh] bg-secondary overflow-hidden' >
            <div className='relative h-full'>
                <div className='relative w-[100vw] md:w-[90vw] h-full mx-auto  bg-cover bg-center bg-fixed'
                    style={{ backgroundImage: 'url(https://images.pexels.com/photos/14367420/pexels-photo-14367420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)' }}
                >
                    {/* chữ chìm dưới background */}
                    <div className='absolute top-0 left-0 w-full h-full bg-primary/85 '>
                        <span className='absolute top-0 left-0 text-white/15 text-[200px] w-[120%]  h-[200px] '>IDO ARCHITECT</span>
                    </div>
                    {/* <div className='absolute top-0 w-12/12 h-full bg-white/30'></div> */}
                </div>

                <div className='w-[100%] absolute top-[10%] md:top-[10%] xl:top-[15%] 2xl:top-[15%] left-[20%] mx-auto py-10'>
                    <div className=' w-8/12 md:5/12 flex flex-col items-center gap-10 md:gap-5'>

                        {/* bút video nhúng link youtube */}
                        <Link
                            href='https://youtube.com'
                            className='relative bg-secondary rounded-full w-[100px] h-[100px] flex justify-center items-center mb-5'>
                            <Play className='text-white' size={56} strokeWidth={1} />
                            <span className="absolute top-4 right-[30%] flex h-3 w-3 -translate-x-5">
                                <span className="animate-ping absolute inline-flex h-20 w-20  -right-10 -top-1 rounded-full bg-secondary opacity-75"></span>
                                {/* <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span> */}
                            </span>
                        </Link>
                        <h2 className='text-secondary text-[32px] md:text-[34px]  text-center leading-[50px] md:leading-[60px]  xl:leading-[80px] font-[600px]'>IDO ARCHITECT,
                        {
                            letters.map((letter,index)=>(
                                <motion.span
                                key={index}
                                initial={{opacity:0}}
                                whileInView={{opacity:1}}
                                transition={{
                                    delay: index*0.1
                                }}
                                className=' text-white '>
                                     {letter}</motion.span>
                            ))
                        }
                        </h2>
                       
                        <motion.div 
                        initial={{opacity:0}}
                        whileInView={{opacity:100}}
                        viewport={{once:true}}
                        transition={{
                            duration:2,
                            type:"spring"
                        }}
                        className='w-full flex justify-center items-center'>
                            <MainButton
                                slug='/blog'
                                label='XEM THÊM'
                                isSecondaryStyle
                                className="w-[90%] md:w-[40%] lg:w-[35%] xl:w-[25%] 2xl:w-[20%]  "
                            />
                        </motion.div>

                    </div>
                </div>
            </div>

        </section>
    )
}

export default Media