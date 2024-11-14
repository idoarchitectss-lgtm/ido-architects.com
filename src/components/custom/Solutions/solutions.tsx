'use client'

import MainButton from '../mainButton'
import { motion } from "framer-motion"
const Solutions = () => {
    const text = "đem đến giải pháp tối ưu cho hàng trăm chủ đầu tư";
    const letters = text.split('');
    return (
        <section className='relative h-[80vh] md:h-[45vh] bg-secondary ' >
            <div className='relative my-10 h-full'>
                <div className='w-[100vw] md:w-[90vw] h-full mx-auto  bg-cover bg-center bg-fixed'
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}
                >
                    {/* lớp phủ nền */}
                    <div className='absolute top-0 w-12/12 h-full bg-white/30'></div>
                    <div className='w-full md:w-10/12 lg:w-8/12 h-full mx-auto flex flex-col justify-center items-center '>
                        <motion.div className=' flex flex-col justify-center items-center px-5'>
                            <h2 className=' text-primary leading-[70px] text-5xl font-[600] '><span className='text-secondary font-[700]'>
                                IDO ARCHITECTS </span>
                                {letters.map((letter, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {letter}
                                    </motion.span>

                                ))}
                            </h2>

                        </motion.div>
                        <motion.div 
                        initial={{scale:0.2, opacity:0}}
                        whileInView={{scale:1, opacity:1}}
                        viewport={{ once: true }}
                        transition={
                          {
                            duration:2,
                            delay:0.5,
                            staggerChildren:0.5,
                            
                            type:"spring",
                            ease:[0.6, 0.01, -0.05, 0.9]
                          }
                        }
                        className=' flex flex-col justify-center items-center w-full'>
                            <MainButton
                                className='w-[70%] md:w-[40%] lg:w-[35%] xl:w-[25%] 2xl:w-[20%] '
                                slug='/contact'
                                label='LIÊN HỆ'
                            />
                        </motion.div>
                    </div>
                </div>



            </div>

        </section>
    )
}

export default Solutions