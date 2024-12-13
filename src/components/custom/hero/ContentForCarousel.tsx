'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronRight } from 'lucide-react';

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
            className=" w-full h-full md:w-[450px] lg:w-[600px] absolute z-20 top-0 left-0 md:top-0 md:left-[22%] xl:left-[15%] xl:top-[5%]  ">
            <div className=" w-full h-full md:mx-auto flex flex-col gap-5 bg-transparent justify-between items-center px-5 py-20 lg:py-36 lg:px-24">
                <div className="w-full flex flex-col items-start justify-center  ">
                    <p className="text-sm font-semibold text-white border-l-[1px] border-secondary pl-2 uppercase tracking-[2px]">
                        {subTitle}
                    </p>
                    <h2 className="text-[32px] md:text-[40px] font-[700] leading-[50px] text-white tracking-wider line-clamp-5">{heroTitle}</h2>
                    <p className="text-white font-semibold line-clamp-2">{text}</p>
                </div>
                <div 
                onClick={() => router.push('/lien-he')}
                className="group w-full cursor-pointer">
                    <Button
                        variant="outline"
                        className="border-neutral-50 rounded-none text-white group-hover:bg-secondary/80 hover:text-white duration-500 w-full py-7 hover:border-none cursor-pointer shadow-xl shadow-secondary/30 bg-black/30"
                    >
                        Liên hệ Ido Architects
                        <ArrowRight className='w-5 h-5' />
                    </Button>

                </div>
            </div>
        </motion.div>
    )
}

export default ContentForCarousel