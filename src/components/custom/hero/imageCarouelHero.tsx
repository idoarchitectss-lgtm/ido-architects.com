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
import { hero } from "@/types/typeForWordpressData"
import { useEffect, useState } from "react"



const ImageCarouselHero = ({ heroArr }: { heroArr: hero['heros']['nodes'] }) => {

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
        }, 8000)
        return () => clearInterval(intervalId)

    }, [api, autoPlay])
    const gotoIndexedItem = (index: number) => {
        api?.scrollTo(index)
    }
    return (
        <Carousel
            setApi={setApi}
            opts={{
                align: "start",
                loop: true,
            }}
            className="relative ml-0 overflow-hidden">
            <CarouselContent className="relative w-full h-[690px] ml-0">
                {heroArr?.map((item, index) => {
                    const heros = item.heros.hero
                    return (
                        <CarouselItem className="w-full h-full flex flex-row ml-0 relative pl-0 "
                            key={index}>
                            <div className="absolute left-0 top-0 w-full h-full bg-black/15 "></div>
                            <Image
                                priority
                                src={heros.banner_img.node.sourceUrl}
                                alt={heros.banner_img.node.altText || "hero banner"}
                                width={1800}
                                height={1200}
                                className=" w-full h-full object-cover object-center filter brightness-75"
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
            <div className='absolute w-full top-[85%] flex flex-row gap-2 justify-center items-center h-[100px] z-10'>
                {heroArr.map((_, index) => (
                    <button
                        onClick={() => gotoIndexedItem(index)}
                        className={
                            `
                            w-4 h-4 rounded-full duration-500
                            ${index === currentIndex ? "bg-secondary h-[7px] w-[70px] rounded-xl " : "bg-neutral-100/70"}
                            `}
                        key={index}>
                    </button>
                ))}
            </div>

        </Carousel>
    )
}

export default ImageCarouselHero