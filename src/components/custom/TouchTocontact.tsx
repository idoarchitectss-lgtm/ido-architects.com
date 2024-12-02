'use client'
import Image from 'next/image'
import React from 'react'
import ContactForm from './forms/ContactForm'
import Container from './container'

import { motion } from "framer-motion"
import Link from 'next/link'

interface TouchToContactProps {
    src: string;
    labelOfForm: string;
}
const TouchToContact: React.FC<TouchToContactProps> = ({
    src,
    labelOfForm
}) => {

    const text = "Bạn đang cần đơn vị tư vấn thiết kế chuyên nghiệp tại Đà Nẵng?"

    return (
        <section
            id='touch-to-contact'
            className='mt-20 p-0 md:p-10 h-[750px] md:h-[1000px] lg:h-[600px] bg-neutral-100 flex justify-center items-center'>
            <Container className='w-full flex justify-center items-center'>
                <div className='w-full flex flex-col lg:flex-row justify-center items-center py-10 md:py-15 '>
                    <motion.div 
                    initial={{ opacity: 0, translateX: -100 }}
                    whileInView={{ opacity: 1, translateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2 }}
                    className='flex-1 w-full lg:w-5/12 lg:flex flex-row gap-10 cursor-pointer'>
                        <Link href='/lien-he'>
                            <Image
                                src={src}
                                alt='touch-to-contact'
                                width={1000}
                                height={800}
                                className='w-full h-full object-cover '
                            />
                        </Link>
                    </motion.div>
                    <motion.div
                    initial={{ opacity: 0, translateX: 100 }}
                    whileInView={{ opacity: 1, translateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2 }}
                        className='flex-1 w-full lg:w-5/12 flex justify-center items-center  cursor-pointer mt-12'>
                        <ContactForm
                            labelOfForm={labelOfForm}
                            btnColor='bg-primary hover:bg-primary/90'
                        />
                    </motion.div>
                </div>
            </Container>
        </section>
    )
}

export default TouchToContact