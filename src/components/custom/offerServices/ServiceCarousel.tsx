import { MoveRight, Pickaxe, StepForward } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious

} from '@/components/ui/carousel';
import ServiceItem from '@/components/custom/offerServices/serviceItem';
import { servicesData } from '@/data/mockedData/IdoServices/idoServicesData';
import { ServicesNodeArr } from '@/types/typeForWordpressData';


interface ServiceCarouselProps {
    servicesArr:ServicesNodeArr
}
const ServiceCarousel:React.FC<ServiceCarouselProps> = ({
    servicesArr
}) => {
    return (

        <Carousel className='relative'>
            <CarouselContent className='px-10'>
                {servicesArr.map((service,index)=>(
                <CarouselItem 
                key={index}
                className='basis-full md:basis-2/3 lg:basis-1/3'>
                    <ServiceItem 
                    service={service}
                    />
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselNext className='hidden md:block absolute right-[3rem] top-[25%] w-12 h-12 md:right-[0.5rem] md:top-[35%] border-[1px] border-primary bg-white'/>
            <CarouselPrevious className='hidden md:block absolute left-10 top-[25%] w-12 h-12 md:left-5 md:top-[35%] border-[1px] border-primary bg-white' />
            <div className='lg:hidden bg-gradient-to-l from-neutral-100 to-transparent h-full w-24 absolute top-0 right-0 translate-x-5'>
            </div>
        </Carousel>


    )
}

export default ServiceCarousel