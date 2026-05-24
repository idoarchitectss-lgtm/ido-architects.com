'use client'
import { PlayCircle } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface IntroductionProp {
  title: string;
  img: string;
  generalInformation?: string;
  vision?: string;
  mission?: string;
}

const IntroductionAboutCompany: React.FC<IntroductionProp> = ({ title, img, generalInformation, vision, mission }) => {
  return (
    <div className=' lg:text-white'>
      <motion.div
        whileInView={{ opacity: 1, translateX: 0 }}
        initial={{ opacity: 0, translateX: 100 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className='w-full lg:w-[50%] text-center mx-auto my-10 px-2'>
        <h2 className='text-3xl font-[700] text-center leading-normal tracking-wider'>
          {title}
        </h2>
      </motion.div>
      <motion.div
        whileInView={{ opacity: 1, translateX: 0 }}
        initial={{ opacity: 0, translateX: -100 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}

        className='flex flex-col lg:flex-row gap-5 justify-center items-center'>
        <div className='relative flex-1 p-0 md:p-20'>
          <div className='w-full md:w-[500px] h-[300px] mx-auto shadow-xl'>
            <Image
              src={img}
              alt="Giới thiệu chung về Ido Architects"
              width={1200}
              height={800}
              className='w-full h-full object-cover filter brightness-75'
            />
            <div className='absolute left-[50%] bottom-[50%] w-10 h-10 z-10 '>
              <PlayCircle className='text-white h-14 w-14 ' />
            </div>
          </div>
        </div>
        <div className='flex-1 flex flex-col gap-2 text-neutral-500 mt-10'>

          <div className='flex flex-row items-center justify-center'>

            <div className='group flex-auto bg-neutral-100  p-7 border-l-[1px] border-secondary hover:bg-secondary  hover:text-white cursor-pointer duration-500 flex flex-col overflow-hidden'>
              <p className='text-base font-[500]'>
                Chúng tôi được thành lập vào tháng 4 năm 2018, tại Thành phố Đà Nẵng. Founder/CEO là KTS.Lại Tấn Hoàng với niềm đam mê kiến trúc, mong muốn tạo ra giá trị cho mỗi dự án mà chúng tôi thiết kế.
              </p>
              <div className='my-2'></div>
              <p className='text-base font-[500]'>
              IDO-ARCHITETCS là từ viết tắt của in-design-out mang hàm ý "tích hợp thiên nhiên vào công trình"
                I: in - không gian bên trong.
                D: design - thiết kế I kết nối.
                O: out - yếu tố bên ngoài I môi trường thiên nhiên xung quanh công trình.
                Với IDO-ARCHITECTS, không gian không chỉ là nơi ở, mà còn là sự kết nối hài hòa giữa bên trong và bên ngoài, mang đến trải nghiệm sống tràn đầy cảm hứng và bền vững.
              </p>
            </div>
          </div>

          <div className='bg-neutral-100  p-7 border-l-[1px] border-secondary hover:bg-secondary  hover:text-white cursor-pointer duration-500'>
            <p className='text-base font-[500]'>
            Chúng tôi định hướng sẽ trở thành công ty hàng đầu kiến tạo nên những công trình với lối kiến trúc hiện đại kết hợp tối giản, cá nhân hóa trong từng dự án ,đưa đến những giải pháp tối ưu trong không gian sống . Tôn trọng thiên nhiên, luôn đưa cây xanh vào không gian sống tăng sự kết nối giữa thiên nhiên và con người . Mang lại cho khách hàng trải nghiệm sống tràn đầy cảm hứng và chất lượng bền bững.
            </p>
          </div>
          <div className='bg-neutral-100  p-7 border-l-[1px] border-secondary hover:bg-secondary  hover:text-white cursor-pointer duration-500'>
            <p className='text-base font-[500]'>
            Cùng với việc theo đuổi sự phát triển bền vững, IDO-ARCHITECTS luôn nỗ lực không ngừng để mang đến những sản phẩm và dịch vụ tốt nhất cho Quý khách hàng bằng tất cả sự tâm huyết, tận tâm và trách nhiệm cao nhất.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default IntroductionAboutCompany
