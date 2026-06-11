'use client'
import { heroStatic } from '@/data/staticData';
import ImageCarouselHero from './imageCarouelHero'


const Hero = () => {
const heroArr = heroStatic();
  return (
    <section className='relative flex-row items-stretch h-[calc(100svh-72px)] md:h-[calc(100svh-90px)] w-full overflow-hidden'>
      <ImageCarouselHero
        heroArr={heroArr}
      />
    </section>
  )
}

export default Hero