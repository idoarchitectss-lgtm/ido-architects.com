'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import ContentForCarousel from "./ContentForCarousel"
import { hero } from "@/types/typeForWordpressData"
import { useEffect } from "react"


interface ImageCarouselHeroProps {
    heroArr: hero['edges']
}

const ImageCarouselHero = ({heroArr}:ImageCarouselHeroProps) => {

    useEffect(()=> {
console.log(heroArr)
    })
    return (
        <Carousel className="relative w-full h-full ml-0 overflow-hidden">
            <CarouselContent className="relative w-full h-[85vh] ml-0">
                {heroArr.map((heroItem, index) => { 
                    const heros = heroItem.node.heros
                    return(
                    <CarouselItem className="flex flex-row ml-0 h-full  relative pl-0 w-[105%]"
                    key={index}>
                        <div className="absolute left-0 top-0 w-full h-full bg-black/15 "></div>
                        <Image
                            priority
                            src={heros.heroBanner.node.sourceUrl}
                            alt={heros.heroTitle}
                            width={1800}
                            height={1200}
                            className="
                            w-full h-full
                            object-cover object-center
                            "
                        />
                        <ContentForCarousel 
                        heroTitle={heros.heroTitle}
                        subTitle={heros.heroSubtitle}
                        text={heros.heroBodyText}
                        />
                    </CarouselItem>
                )})}
            </CarouselContent>
            {/* <div className={`${heroArr.length > 1 ? 'absolute': 'hidden'}   w-[10px] h-[100px] md:right-20 xl:right-[25%] 2xl:right-[30%] md:top-[85%]  md:flex flex-row items-center`}>
                <CarouselPrevious className=' w-12 h-12  bg-white' />
                <CarouselNext className=' w-12 h-12  bg-white' />
            </div> */}

        </Carousel>
    )
}

export default ImageCarouselHero