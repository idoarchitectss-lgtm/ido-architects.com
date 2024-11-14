import React from 'react'
import InfoForServiceItem from './InfoForServiceItem';
import Image from 'next/image';
import { ConstructionIcon, Pickaxe } from 'lucide-react';
import { ServicesNodeArr } from '@/types/typeForWordpressData';


interface ServiceItemProp {
    service:ServicesNodeArr[number]
}

const ServiceItem:React.FC<ServiceItemProp> = ({service}) => {

  return (
    <div className=' w-full'>
                        <div
                        className='w-full group'>
                            <div className='relative w-full h-[250px] rounded-md overflow-hidden'>
                                <Image
                                    src={service?.featuredImage?.node.sourceUrl || "https://cdn.stocksnap.io/img-thumbs/960w/scenic-landscape_WPPJNTMEAX.jpg"}
                                    alt={service?.title}
                                    width={1200}
                                    height={800}
                                    className='w-full h-full object-cover  group-hover:scale-125 duration-300 cursor-pointer'
                                />
                                <div className='absolute bottom-0 left-0 bg-primary group-hover:bg-secondary duration-300 text-white h-14 w-14 flex flex-col justify-center items-center rounded-tr-xl' >
                                    <ConstructionIcon />
                                </div>
                            </div>

                            <div>
                                <InfoForServiceItem
                                    title={service.title}
                                    excerpt={service.excerpt}
                                    slug={service.slug}
                                />
                            </div>
                        </div>
                    </div>
  )
}

export default ServiceItem;