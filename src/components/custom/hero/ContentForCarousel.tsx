'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation';

interface ContectForCarouselProps {
    heroTitle: string;
    subTitle: string;
    text: string;
}

const ContentForCarousel = ({ heroTitle, subTitle, text }: ContectForCarouselProps) => {
    const router = useRouter();
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className=" w-[320px] absolute z-20 top-10 left-5 md:top-[20%] md:left-[12%] xl:left-[15%] 2xl:top-[10%] 2xl:left-[15%] 3xl:left-[50%]  ">
            <div className=" w-full md:mx-auto flex flex-col gap-10 bg-transparent">
                <div className="w-full flex flex-col items-start justify-center gap-16 ">
                    <p className="text-sm font-semibold text-secondary border-l-[1px] border-secondary pl-2">
                        {subTitle}
                    </p>
                    <h2 className="text-[60px] font-[700] leading-[60px] text-white">{heroTitle}</h2>
                    <p className="text-white font-semibold line-clamp-2">{text}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                    {/* <Button
                        onClick={() => router.push('/portfolios')}

                        className="w-full hover:bg-primary duration-500 rounded-none h-12"
                        variant="secondary">
                        <span className="text-white">
                            Danh Mục Dự Án
                        </span>
                    </Button> */}
                    <Button
                        onClick={() => router.push('/contact')}
                        variant="outline"
                        className="w-full h-12 rounded-sm text-white hover:bg-secondary hover:text-white duration-500 "
                    >LIÊN HỆ
                    </Button>

                </div>
            </div>
        </motion.div>
    )
}

export default ContentForCarousel