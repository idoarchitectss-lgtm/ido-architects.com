'use client'
import { PlayCircle } from 'lucide-react'
import Image from 'next/image'
import {motion} from 'framer-motion'

interface IntroductionProp {
    title:string;
    img:string;
    generalInformation?:string;
    vision?:string;
    mission?:string;
}

const IntroductionAboutCompany:React.FC<IntroductionProp> = ({title,img,generalInformation,vision,mission}) => {
  return (
    <div className=' lg:text-white'>
          <motion.div
          whileInView={{ opacity: 1 ,translateX:0}}
          initial={{ opacity: 0 ,translateX:100}} 
          viewport={{once:true}}
          transition={{duration:2}}
          className='w-full lg:w-[50%] text-center mx-auto my-10 px-2'>
          <h2 className='text-3xl font-[700] text-center leading-normal tracking-wider'>
            {title}
          </h2>
          </motion.div>
          <motion.div 
           whileInView={{ opacity: 1 ,translateX:0}}
           initial={{ opacity: 0 ,translateX:-100}} 
           viewport={{once:true}}
           transition={{duration:2}}
          
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

                <div className='flex-auto bg-neutral-100  p-7 border-l-[1px] border-secondary hover:bg-secondary  hover:text-white cursor-pointer duration-500 flex flex-row overflow-hidden'>
                  <p className='text-base font-[500]'>
                    Ido Architects Thành lập vào năm 2019 tại Thành phố Đà Nẵng, Việt Nam. Được tạo nên bởi những con người có niềm đam mê và niềm tin vào kiến trúc một cách mãnh liệt. Tại đây, chúng tôi quan niệm giúp cho mọi thứ trong cuộc sống trở nên tốt đẹp hơn thông qua kiến trúc.
                  </p>
                </div>
              </div>

              <div className='bg-neutral-100  p-7 border-l-[1px] border-secondary hover:bg-secondary  hover:text-white cursor-pointer duration-500'>
                <p className='text-base font-[500]'>
                  Tầm nhìn của chúng tôi là nghiên cứu và đưa ra các giải pháp tư vấn thiết kế và xây dựng áp dụng vào các công trình nhà ở dân dụng. Trở thành công ty tư vấn thiết kế xây dựng hàng đầu Việt Nam, biểu tượng của sự sáng tạo và đổi mới trong lĩnh vực thiết kế kiến trúc Việt Nam, kiến tạo những không gian sống độc bản, xứng tầm, định hình xu hướng tương lai
                </p>
              </div>
              <div className='bg-neutral-100  p-7 border-l-[1px] border-secondary hover:bg-secondary  hover:text-white cursor-pointer duration-500'>
                <p className='text-base font-[500]'>
                  Sứ mệnh tìm ra điểm chạm mà tại đó con người, thiên nhiên, nghệ thuật và cuộc sống được cân bằng, hòa quyện. Mang lại cho khách hàng sự trải nghiệm không gian sống chất lượng, thẩm mỹ và kinh tế. Đội ngũ Palm luôn cập nhật xu hướng và tìm những giải pháp thiết kế xây dựng tối ưu nhằm mang lại giá trị thiết thực cho khách hàng.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
  )
}

export default IntroductionAboutCompany
