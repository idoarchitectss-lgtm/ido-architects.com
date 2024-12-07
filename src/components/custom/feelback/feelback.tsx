'use client'

import Image from "next/image";
import Container from "../container";
import Title from "../title";

import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,

} from '@/components/ui/carousel'
import { Quote, Star } from "lucide-react";
import FeelbackItem from "./FeelbackItem";
import { feelbackData } from "@/data/mockedData/feelbacks/feelbackData";

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react";


const Feelback = () => {
    // MOCKED DATA
    const feelbacksArray = feelbackData;

    const [api,setApi] = useState<CarouselApi>()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [autoPlay, setAutoPlay] = useState(true)
  
    useEffect(() => {
  
      if (!api || !autoPlay) {
          return
      }
      setCurrentIndex(api.selectedScrollSnap())
      // phát hiện index đang được chọn
      api.on("select", () => {
          setCurrentIndex(api.selectedScrollSnap())
      })
      const intervalId = setInterval(() => {
          api.scrollNext()
      }, 4000)
      return () => clearInterval(intervalId)
  
  }, [api, autoPlay])
    const gotoIndexedItem = (index: number) => {
      api?.scrollTo(index)
  }

    return (
        <section className="relative mt-16 h-[500px]">
            <div className="w-full h-full md:w-10/12 mx-auto">
                <div className="">
                    <Title
                        title="Phản hồi từ khách hàng"
                        subtitle="Our Client"
                        islightBg
                    />
                </div>
                <motion.div 
                initial={{ opacity: 0, translateY: 100 }}
                whileInView={{ opacity: 1, translateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 2 }}
                className="mt-10">
                    <Carousel
                     setApi={setApi}
                     opts={{
                         align:"start",
                         loop:true,
                     }}
                    >
                        <CarouselContent className="px-4 pl-2 mx-auto">
                            {feelbacksArray?.map((item, index) => (
                                <CarouselItem
                                    key={index}
                                    className="basis-full md:basis-1/2  xl:basis-1/4 mr-5 "
                                >
                                    <div className="flex flex-col justify-start gap-5 bg-neutral-100 h-[320px] py-10 px-10 cursor-move">
                                        <div className="border-l-[2px] border-secondary/80 px-5 ">
                                            <p className="text-neutral-500 text-lg leading-8">{item.commentOfAuthor}</p>
                                        </div>
                                        <div className="flex flex-row justify-start items-center gap-5">
                                            <div className="w-16 h-16 rounded-full">
                                                <Image
                                                    src={item.urlFeaturedImage}
                                                    alt={item.nameOfAuthor}
                                                    width={500}
                                                    height={500}
                                                    className="object-cover w-full h-full rounded-full "
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center items-start gap-0">
                                                <p className="text-base font-[700] text-neutral-700">{item.nameOfAuthor}</p>
                                                <p className="text-sm font-[400] text-neutral-500">{item.jobOfAuthor}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className='absolute w-full top-[80%] flex flex-row gap-2 justify-center items-center h-[200px] z-10'>
                {feelbacksArray.map((_, index) => (
                    <button
                        onClick={() => gotoIndexedItem(index)}
                        className={
                            `
                            w-3 h-3 rounded-full duration-500
                            ${index === currentIndex ? "bg-secondary h-[7px] w-[70px] rounded-xl " : "bg-black/30"}
                            `}
                        key={index}>

                    </button>

                ))}
            </div>
                    </Carousel>
                </motion.div>
            </div>

        </section>




    )
}

export default Feelback;