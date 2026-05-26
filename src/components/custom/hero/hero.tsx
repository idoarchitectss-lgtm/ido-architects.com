'use client'
import { heroStatic } from '@/data/staticData';
import ImageCarouselHero from './imageCarouelHero'


const Hero = () => {
const heroArr = heroStatic();
  return (
    <section className='relative flex-row items-stretch h-[690px] w-[100%] overflow-hidden'>
      <ImageCarouselHero
        heroArr={heroArr}
      />
    </section>
  )
}

export default Hero