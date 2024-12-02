import React from 'react'
import Image from 'next/image';
import { ServicesNodeArr } from '@/types/typeForWordpressData';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion'


interface ServiceItemProp {
    service: ServicesNodeArr[number]
}

const ServiceItem: React.FC<ServiceItemProp> = ({ service }) => {
    

    return (
        <motion.div 
        initial={{ opacity: 0.5, translateX: 100 }}
                        whileInView={{ opacity: 1, translateX: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
        className=' w-full h-full'>
            <Card
                className='w-full group rounded-none  shadow-2xl h-full'>
                <div className='relative w-full h-[220px]  overflow-hidden'>
                    <Image
                        src={service?.featuredImage?.node.sourceUrl || "https://cdn.stocksnap.io/img-thumbs/960w/scenic-landscape_WPPJNTMEAX.jpg"}
                        alt={service?.title}
                        width={1200}
                        height={800}
                        className='w-full h-full object-cover  group-hover:scale-110 duration-500 cursor-pointer'
                    />
                </div>
                <div className='uppercase text-xl font-[700] text-center py-5 text-neutral-700'>
                    <Link href={`cac-dich-vu/${service.slug}`}>
                    <h3>{service.title}</h3>
                    </Link>
                </div>

            </Card>
        </motion.div>
    )
}

export default ServiceItem;