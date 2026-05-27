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
import { useRouter } from 'next/navigation'

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

    const router = useRouter();

    useEffect(() => {
        // console.log("check portfoliosArray", portfoliosArray)
    }, [portfoliosArray])
    //     const portfoliosArray = await allPortfolios();
    //   const portfolioArrForHome = portfoliosArray.slice(0, 6);

    const [api, setApi] = useState<CarouselApi>()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [autoPlay, setAutoPlay] = useState(true)

    useEffect(() => {
        if (!api) return

        setCurrentIndex(api.selectedScrollSnap())
        api.on("select", () => {
            setCurrentIndex(api.selectedScrollSnap())
        })
    }, [api])

    useEffect(() => {
        if (!api || !autoPlay) return

        const intervalId = setInterval(() => {
            api.scrollNext()
        }, 4000)
        return () => clearInterval(intervalId)

    }, [api, autoPlay])

    const gotoIndexedItem = (index: number) => {
        if (!api) return
        // pause autoplay temporarily, then resume
        setAutoPlay(false)
        api.scrollTo(index)
        setTimeout(() => setAutoPlay(true), 5000)
    }
    return (
        <section className='relative'>
            <div className='my-12 md:my-24'>
                <div className='flex flex-col items-center justify-between gap-6 md:gap-10 w-full mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className='w-full'>
                        <Title
                            title={title}
                            subtitle={subtitle}
                            islightBg={islightBg}
                            text={text}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className='w-full'
                    >
                        <Carousel
                            setApi={setApi}
                            opts={{
                                align: "start",
                                loop: false,
                            }}
                            className='w-full'>
                            <CarouselContent className='-ml-3 md:-ml-4'>
                                {portfoliosArray?.map((item, index) => (
                                    <CarouselItem
                                        key={index}
                                        onClick={() => router.push(`/du-an/${item.slug}`)}
                                        className='pl-3 md:pl-4 basis-4/5 sm:basis-1/2 lg:basis-1/4 h-[280px] sm:h-[360px] xl:h-[400px] cursor-pointer group overflow-hidden'
                                    >
                                        <div className='relative w-full h-full flex flex-col justify-end overflow-hidden rounded-lg'>
                                            {/* icon dự án nổi bật */}
                                            <div className={`absolute w-8 h-8 top-4 right-4 z-10 ${(item.project.isFeatured === true) ? "block" : "hidden"}`}>
                                                <Image
                                                    src={'/image/star.png'}
                                                    alt='featured icon'
                                                    width={100}
                                                    height={100}
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>
                                            {/* images of project */}
                                            <div className='absolute inset-0 -z-10'>
                                                <Image
                                                    src={item.featuredImage.node.sourceUrl}
                                                    alt={item.project.nameOfProject}
                                                    width={1200}
                                                    height={800}
                                                    className='object-cover w-full h-full brightness-75 group-hover:scale-110 duration-500'
                                                />
                                            </div>
                                            {/* gradient overlay */}
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent -z-10' />
                                            {/* content of project */}
                                            <div className='mb-4 px-4'>
                                                <h3 className='uppercase text-white text-base md:text-xl font-bold text-center group-hover:-translate-y-1 duration-500 line-clamp-2'>
                                                    {item.project.nameOfProject}
                                                </h3>
                                                <p className='text-sm text-neutral-300 text-center group-hover:opacity-100 opacity-0 duration-500 mt-1'>
                                                    {item.project.generalInformation.propertyType}
                                                </p>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                        </Carousel>

                        {/* Dot indicators — outside carousel, below content */}
                        <div className='flex flex-row gap-2 justify-center items-center mt-5'>
                            {portfoliosArray.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => gotoIndexedItem(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                    className={`h-[3px] rounded-full transition-all duration-500
                                        ${index === currentIndex
                                            ? "w-12 bg-secondary"
                                            : "w-6 bg-black/30 hover:bg-black/50"
                                        }`}
                                />
                            ))}
                        </div>
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