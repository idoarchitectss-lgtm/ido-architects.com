'use client'
import ImageCarouselHero from './imageCarouelHero'
import { hero } from '@/types/typeForWordpressData'

const Hero = ({ heroArr }: { heroArr: hero['heros']['nodes'] }) => {
  return (
    <section className='relative flex-row items-stretch h-[690px] w-[100%] overflow-hidden'>
      <ImageCarouselHero
        heroArr={heroArr}
      />
    </section>
  )
}

export default Hero