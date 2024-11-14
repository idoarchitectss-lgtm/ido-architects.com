import React from 'react'
import ImageCarouselHero from './imageCarouelHero'
import { hero } from '@/types/typeForWordpressData'


interface HeroProps {
  heroArr: hero['edges']
}


const Hero = ({heroArr}:HeroProps) => {
  return (
    <section className='relative flex-col items-stretch h-[100vh] w-[100vw] overflow-hidden'>
        <ImageCarouselHero 
        heroArr={heroArr}
        />
    </section>
  )
}

export default Hero