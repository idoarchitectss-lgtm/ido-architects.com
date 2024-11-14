'use client'
import React from 'react'
import Container from '@/components/custom/container'
import Image from 'next/image'
import MainButton from '../mainButton'
import {motion} from "framer-motion"


const AboutUs = () => {
    return (
        <section>
            <div className='relative my-15 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700 to-primary'>
                <p className='absolute bottom-14 left-[10%] md:left-[50%] sla text-blue-800 text-[300px] md:text-[400px] z-[1px] '>IDO </p>

                <Container>
                    <div className='relative z-[2px] w-12/12 h-[850px] md:h-[950px] py-16 mx-auto flex flex-row justify-center items-center'>
                        <div className='flex flex-col lg:flex-row justify-center items-center gap-20 h-[70%] '>

                            {/* Hình ảnh */}
                            <motion.div 
                            initial={{translateX:-300, opacity:0}}
                            whileInView={{translateX:0, opacity:1}}
                            viewport={{ once: true }}
                            transition={
                                {
                                    duration:2,
                                    type:"spring",
                                    delay:1
                                }
                            }   
                            className='flex-auto w-12/12 md:w-10/12 lg:w-5/12 h-[300px] md:h-[400px] bg-white py-8 px-10 rounded-2xl '>
                                <Image
                                    src="https://plus.unsplash.com/premium_photo-1681823251498-d79148213f39?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt='About us'
                                    width={1400}
                                    height={1000}
                                    className='object-cover w-[100%] md:w-[85%] mx-auto h-[100%]'
                                />

                            </motion.div>

                            {/* Nội dung */}
                            <motion.div
                            initial={{translateY:-500, opacity:0}}
                            whileInView={{translateY:0, opacity:1}}
                            viewport={{ once: true }}
                            transition={
                                {
                                    duration:2,
                                    type:"spring",
                                    delay:1,
                                }
                            }
                            className='flex-none w-full md:w-[600px] w-12/12 lg:w-5/12 text-center md:text-left flex flex-col items-center lg:items-start gap-5'>


                                <div className='flex flex-col justify-center md:justify-start'>
                                    <div className='flex flex-row items-center justify-center lg:justify-start'>
                                        <p className='text-secondary text-sm font-[700] leading-[16px] border-l-[2px] border-secondary inline-block pl-2 py-1'>Những giá trị của chúng tôi</p>
                                        {/* hiệu ứng ping */}

                                        <span className="relative flex h-3 w-3 -translate-x-5">
                                            <span className="animate-ping absolute inline-flex h-20 w-20  -right-10 -top-1 rounded-full bg-secondary opacity-75"></span>
                                            {/* <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span> */}
                                        </span>
                                    </div>

                                    <h2 className='text-white text-[48px] leading-[72px] font-[600] '>VỀ IDO ARCHITECT</h2>
                                    <p className='text-white text-[16px] font-[400] leading-[32px] my-5 line-clamp-4'>
                                    IDO Architect chuyên cung cấp các dịch vụ trong lĩnh vực thiết kế kiến trúc nhà ở, biệt thự, căn hộ, văn phòng, khách sạn; thiết kế nội thất trọn gói; tư vấn giám sát thi công. Chúng tôi luôn đặt sự hài lòng của khách hàng lên hàng đầu và không ngừng nỗ lực để tạo ra những không gian sống đẳng cấp, hiện đại và bền vững.
                                    </p>
                                </div>
                                <div className=' flex flex-col justify-center items-center w-full'>
                                    <MainButton
                                        className='w-[70%] md:w-[40%] lg:w-[60%]  '
                                        slug='/contact'
                                        label='Tìm hiểu thêm'
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </Container>

            </div>
        </section>
    )
}

export default AboutUs