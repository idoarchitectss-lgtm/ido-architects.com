'use client'
import React, { useEffect, useState } from 'react'
import ImageCarouselHero from './imageCarouelHero'
import { hero } from '@/types/typeForWordpressData'
import { CarouselApi } from '@/components/ui/carousel'




const Hero = ({heroArr}:{heroArr:hero['heros']['nodes']}) => {
  // useEffect(() => {
  //   console.log("check hero",heroArr)
  // })

  
  return (
    <section className='relative flex-row items-stretch h-[690px] w-[100%] overflow-hidden'>
        <ImageCarouselHero 
        heroArr={heroArr}
        />
    </section>
  )
}

export default Hero