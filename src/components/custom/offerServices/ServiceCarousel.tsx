'use client'
import React, { useEffect, useState } from 'react'
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

    const [newServicesArr,setNewServicesArr] = useState<ServicesNodeArr>(servicesArr)
    // Đảo ngược mảng
    useEffect(() => {
        const reverServiceArr =  servicesArr.reverse()
        setNewServicesArr(reverServiceArr)
        // console.log("1",reverServiceArr)
        // console.log("2",servicesArr)

    },[servicesArr,])
    return (

        <Carousel className='relative h-full'>
            <CarouselContent className='px-10 h-full'>
                {newServicesArr.map((service,index)=>(
                <CarouselItem 
                key={index}
                className='basis-full md:basis-2/3 lg:basis-1/3 h-full'>
                    <ServiceItem 
                    service={service}
                    />
                </CarouselItem>
                ))}
            </CarouselContent>
            
            <div className='lg:hidden bg-gradient-to-l from-neutral-100 to-transparent h-full w-24 absolute top-0 right-0 translate-x-5'>
            </div>
        </Carousel>


    )
}

export default ServiceCarousel