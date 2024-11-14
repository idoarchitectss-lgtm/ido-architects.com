'use client'
import Image from 'next/image'
import React from 'react'
import ContactForm from './forms/ContactForm'
import Container from './container'

import {motion} from "framer-motion"

const TouchTocontact = () => {

    const text = "Bạn đang cần đơn vị tư vấn thiết kế chuyên nghiệp tại Đà Nẵng?" 
    const letters = text.split('')

    return (
        <section className='mt-20 h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700 to-primary'>
            <Container>
                <div className='flex flex-row justify-around items-center gap-20 py-20 '>
                    <div className='hidden w-5/12 lg:flex flex-row gap-10'>
<h2>

                    {letters.map((letter,index)=> (
                        <motion.span 
                        initial={{opacity:0}}
                        whileInView={{opacity:1}}
                        viewport={{once:true}}
                        transition={{delay:index*0.1}}
                        key={index}
                        className='text-white text-6xl font-[600] leading-snug'>
                            {letter}
                        </motion.span>
                    ))}
                    </h2>
                    </div>
                    <motion.div 
                    initial={{opacity:0.5, translateY:500}}
                    whileInView={{opacity:1, translateY:0}}
                    
                    viewport={{once:true}}
                    transition={{duration:2,type:"spring"}}
                    className='w-full lg:w-5/12 flex justify-center items-center hover:translate-y-2 duration-300 cursor-pointer'>
                        <ContactForm
                            btnColor='bg-primary hover:bg-primary/90'
                        />
                    </motion.div>
                </div>
            </Container>
        </section>
    )
}

export default TouchTocontact