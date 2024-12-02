'use client'
import React, { useEffect } from 'react'
import Container from '@/components/custom/container'
import Image from 'next/image'
import { AboutType } from '@/types/typeForWordpressData'
import MainButton from '../buttons/MainButton'
import {motion} from 'framer-motion'

const AboutUs = ({ about }: { about: AboutType['abouts']['nodes'] }) => {
    return (
        <section className='relative px-2 py-10 md:p-10 h-auto overflow-hidden'>
            <div className='relative w-full h-full flex flex-col justify-center items-center'>
                <Container className='h-full w-full'>
                    {about?.map((item, index) => (
                        <div
                            key={index}
                            className='flex lg:flex-row lg:justify-between items-center flex-col justify-center gap-14 h-full'>
                            {/* text */}
                            <motion.div
                            initial={{ opacity: 0, translateX: -100 }} 
                            whileInView={{ opacity: 1, translateX: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2 }}
                            className='flex-1 flex flex-col justify-center items-center gap-5 h-full w-full md:w-8/12 lg:w-6/12 mx-auto px-0 md:px-16'>
                                <p className='text-secondary font-[700] text-center md:text-left border-l-[1px] border-secondary pl-2'>{item.aboutComponent.subtitle}</p>
                                <h2 className='text-4xl font-[700] text-center md:text-left'>{item.aboutComponent.title}</h2>
                                <p className='text-neutral-500 text-lg leading-8'>{item.aboutComponent.bodytext}</p>
                                {/* <Button className='rounded-none bg-transparent hover:text-secondary border-[1px] border-neutral-500 py-7'>
                                <Link href={item.aboutComponent.button.labelbtn} className=' flex flex-row items-center '>
                                    <span className='text-neutral-500'>{item.aboutComponent.button.labelbtn}</span>
                                    <ChevronDown className='w-5 h-5 text-neutral-500' />
                                </Link>
                                </Button> */}

                                <MainButton
                                
                                labelOfButton='xem thêm'
                                href='/gioi-thieu'
                                />
                            </motion.div>
                            {/* image */}
                            <motion.div 
                             initial={{ opacity: 0, translateX: 100 }} 
                             whileInView={{ opacity: 1, translateX: 0 }}
                             viewport={{ once: true }}
                             transition={{ duration: 2 }}
                            className='relative flex-1 w-[400px] h-[450px] overflow-hidden shadow-2xl group cursor-pointer'>
                                <span className='absolute top-0 left-0 w-full h-full bg-secondary/20 opacity-0 group-hover:opacity-100 duration-500 z-10'></span>
                                <Image
                                    src={item.aboutComponent.image.node.sourceUrl}
                                    alt={item.aboutComponent.image.node.altText}
                                    width={1000}
                                    height={800}
                                    className='w-full h-full object-cover aspect-square cursor-pointer group-hover:scale-110 duration-500'
                                />
                            </motion.div>
                        </div>
                    ))}

                </Container>
            </div>
        </section>
    )
}

export default AboutUs