'use client'
import { portfolios } from '@/types/typeForWordpressData'
import Container from '../container'
import Title from '../title'
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { StarIcon } from '@radix-ui/react-icons'
import MainButton from '../buttons/MainButton';
import { motion } from 'framer-motion'

interface PortfoliosForHomepage {
    portfoliosArray: portfolios[];
    title: string;
    subtitle: string;
    islightBg?: boolean
    text?: string;
    href: string
}

const PortfoliosForHomepage: React.FC<PortfoliosForHomepage> = ({
    portfoliosArray,
    title,
    subtitle,
    islightBg,
    text,
    href
}) => {
    useEffect(() => {
        console.log("check portfoliosArray", portfoliosArray)
    }, [portfoliosArray])
    //     const portfoliosArray = await allPortfolios();
    //   const portfolioArrForHome = portfoliosArray.slice(0, 6);

    const [api, setApi] = useState<CarouselApi>()
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
        <section className='relative'>
            <div className='my-24'>
                <div className='flex flex-col items-center justify-between gap-10 w-full mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className='w-full'>
                        <Title
                            title={title}
                            subtitle={subtitle}
                            islightBg={islightBg}
                            text={text}
                        />
                    </motion.div>
                    <motion.div 
                    initial={{ opacity: 0, translateX: 100 }}
                    whileInView={{ opacity: 1, translateX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2 }}
                    >
                        <Carousel
                            setApi={setApi}
                            opts={{
                                align: "start",
                                loop: false,
                            }}
                            className='w-full'>
                            <CarouselContent className=''>
                                {portfoliosArray?.map((item, index) => (
                                    <CarouselItem key={index}
                                        className='relative basis-full  md:basis-1/2 lg:basis-1/4 h-[450px] xl:h-[400px] gap-5 flex flex-col justify-end mr-5 cursor-pointer group overflow-hidden'
                                    >
                                        {/* icon dự án nổi bật */}
                                        <div className={`absolute w-10 h-10 top-7 right-7 ${(item.project.isFeatured === true) ? "block" : "hidden"}`}>
                                            <Image
                                                src={'/image/star.png'}
                                                alt='featured icon'
                                                width={100}
                                                height={100}
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                        {/* images of project */}
                                        <div className='absolute top-0 left-0 w-full h-full -z-10'>
                                            <Image
                                                src={item.featuredImage.node.sourceUrl}
                                                alt={item.project.nameOfProject}
                                                width={1200}
                                                height={800}
                                                className=' object-cover w-full h-full  filter brightness-75 group-hover:scale-110 duration-500'
                                            />
                                        </div>
                                        {/* content of project */}
                                        <div className=' mb-5 '>
                                            <h3 className='uppercase text-white text-2xl font-[700] text-center group-hover:-translate-y-2 duration-500'>
                                                {item.project.nameOfProject}
                                            </h3>
                                            <p className='text-md text-neutral-300 text-center group-hover:opacity-100 opacity-0 duration-500'>{item.project.generalInformation.propertyType}</p>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className='absolute w-full top-[80%] flex flex-row gap-2 justify-center items-center h-[150px] my-10 z-10'>
                                {portfoliosArray.map((_, index) => (
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

                    <MainButton
                        labelOfButton='Xem tất cả'
                        href={href}
                    />

                </div>
            </div>
        </section>
    )
}

export default PortfoliosForHomepage