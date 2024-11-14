'use client'

import Image from "next/image";
import Container from "../container";
import Title from "../title";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,

} from '@/components/ui/carousel'
import { Quote, Star } from "lucide-react";
import FeelbackItem from "./FeelbackItem";
import { feelbackData } from "@/data/mockedData/feelbacks/feelbackData";

import { motion, useAnimation } from "framer-motion"
import { useEffect } from "react";


const Feelback = () => {
    const scrollY = useAnimation()
    // TODO: get data from api here

    // MOCKED DATA
    const feelbacksArray = feelbackData;

    useEffect(() => {
        scrollY.start({
            y: [0, -1000], // Cuộn từ 0 đến -1000px
            transition: { duration: 1, ease: "easeInOut" },
            repeatCount: "loop",
        });
    })

    return (
        <section className="relative mt-16 h-[70vh] md:my-0 md:h-[90vh]"
            style={{
                backgroundImage: 'url(https://images.pexels.com/photos/7095765/pexels-photo-7095765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
                backgroundSize: 'cover'
            }}>

            <div className="relative  w-[100vw] h-full">
                <div className="absolute w-full h-full top-0 left-0 dark:bg-black bg-white/90"></div>
                <div className="h-full">
                    <Container className="h-full">
                        <div className=" h-full relative flex flex-col justify-center md:items-center w-full ">
                            <div className=" w-full my-7">
                                <Title
                                    title="Khách hàng nói về chúng tôi"
                                    subtitle="Feelback từ khách hàng"
                                    text="Chúng tôi đem đến những giá trị tốt nhất cho khách hàng, sự tỉ mỉ và chu đáo luôn giúp Ido có được nhiều sự tin tưởng của khách hàng"
                                    islightBg
                                />
                            </div>
                            <Carousel
                                className=""
                                opts={{
                                    align: "start",
                                    loop: true,
                                }}
                            >
                                    <CarouselContent className="">
                                        {feelbacksArray?.map((feelback, index) => (
                                            <CarouselItem
                                                key={index}
                                                className='basis-full md:basis-1/3'>
                                                <FeelbackItem
                                                    feelback={feelback}
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                            </Carousel>
                        </div>
                    </Container>
                </div>
            </div>

        </section>
    )
}

export default Feelback;