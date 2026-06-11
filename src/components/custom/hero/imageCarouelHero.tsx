'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import ContentForCarousel from "./ContentForCarousel"
import { HeroArr } from "@/types/types"
import { useEffect, useState } from "react"



const ImageCarouselHero = ({ heroArr }: { heroArr: HeroArr }) => {

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
        }, 8000)
        return () => clearInterval(intervalId)

    }, [api, autoPlay]);

    const gotoIndexedItem = (index: number) => {
        if (!api) return
        setAutoPlay(false)
        api.scrollTo(index)
        setTimeout(() => setAutoPlay(true), 9000)
    };

    return (
        <Carousel
            setApi={setApi}
            opts={{
                align: "start",
                loop: true,
            }}
            className="relative ml-0 overflow-hidden h-full">
            <CarouselContent className="relative w-full h-[calc(100svh-72px)] md:h-[calc(100svh-90px)] ml-0">
                {heroArr?.map((item, index) => {
                    const heros = item.heros.hero
                    return (
                        <CarouselItem className="w-full h-full flex flex-row ml-0 relative pl-0 "
                            key={index}>
                            <div className="absolute left-0 top-0 w-full h-full bg-black/50 "></div>
                            <Image
                                priority
                                src={heros.banner_img.node.sourceUrl}
                                alt={heros.banner_img.node.altText || "hero banner"}
                                width={1800}
                                height={1200}
                                className=" w-full h-full object-cover object-center filter brightness-50"
                            />
                            <ContentForCarousel
                                heroTitle={heros.heroTitle}
                                subTitle={heros.heroSubtitle}
                                text={heros.heroBodyText}
                            />
                        </CarouselItem>
                    )
                })}
            </CarouselContent>
            
            {/* Navigation dots */}
            <div className='absolute bottom-6 left-0 w-full flex flex-row gap-2 justify-center items-center z-10'>
                {heroArr.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => gotoIndexedItem(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-[3px] rounded-full transition-all duration-500
                            ${index === currentIndex
                                ? "w-12 bg-secondary"
                                : "w-6 bg-white/50 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>
        </Carousel>
    )
}

export default ImageCarouselHero