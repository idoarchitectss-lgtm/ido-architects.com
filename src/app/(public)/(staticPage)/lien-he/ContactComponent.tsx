import { Clock10, FacebookIcon, LocateIcon, MailIcon, PhoneForwarded, X } from 'lucide-react'
import React from 'react'
import { InstagramLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import ContactForm from '../../../components/custom/forms/ContactForm'
import {motion} from 'framer-motion'

const ContactComponent = () => {
  const className='w-10 h-10 bg-primary/15 p-2 rounded-full cursor-pointer hover:text-secondary hover:-translate-y-2 duration-500' 
  return (
    <>
    <div className='flex flex-col lg:flex-row justify-between items-start gap-5 my-16'>
      <div className='flex-none w-full lg:w-7/12'>
        <motion.div
         whileInView={{ opacity: 1 ,translateY:0}}
         initial={{ opacity: 0 ,translateY:-100}} 
         viewport={{once:true}}
         transition={{duration:2}}
        >
        <h2 className='text-3xl font-[700]'>Thông tin liên hệ Ido Architect</h2>
        <p className='text-neutral-500 my-4'>Vui lòng liên hệ với chúng tôi nếu bạn cần hổ trợ tư vấn hoặc có bất kỳ câu hỏi nào!</p>
        </motion.div>

        <motion.div 
        whileInView={{ opacity: 1 ,translateX:0}}
        initial={{ opacity: 0 ,translateX:-100}} 
        viewport={{once:true}}
        transition={{duration:2}}
        className='grid grid-cols-2 md:grid-cols-2 gap-2'>

          <div className=' flex flex-col text-center md:flex-row justify-start items-center gap-4 mt-0 border-[1px] border-neutral-300 shadow-md p-8 hover:-translate-y-2 duration-500 cursor-pointer'>
            <div className='bg-primary/15 flex items-center justify-center h-16 w-16 px-4 rounded-md'>
              <LocateIcon size={30} className='text-secondary/80' />
            </div>
            <div className=' flex flex-col justify-start gap-2'>
              <h3 className=' font-bold text-xl'>Địa chỉ</h3>
              <p className='text-neutral-500 text-base'>Tầng 6 ,Danabook , 78 Bạch Đằng, Đà Nẵng</p>
            </div>
          </div>

          <div className=' flex flex-col text-center md:flex-row justify-start items-center gap-4 mt-0 border-[1px] border-neutral-300 shadow-md p-8 hover:-translate-y-2 duration-500 cursor-pointer'>
            <div className='bg-primary/15 flex items-center justify-center h-16 w-16 px-4 rounded-md'>
              <PhoneForwarded strokeWidth={1.5} size={30} className='text-secondary/80' />
            </div>
            <div className=' flex flex-col justify-start gap-2'>
              <h3 className=' font-bold text-xl'>Điện thoại</h3>
              <p className='text-neutral-500 text-base'>+84 097 426 5929</p>
            </div>
          </div>

          <div className='flex flex-col text-center md:flex-row justify-start items-center gap-4 mt-0 border-[1px] border-neutral-300 shadow-md p-8 hover:-translate-y-2 duration-500 cursor-pointer'>
            <div className='bg-primary/15 flex items-center justify-center h-16 w-16 px-4 rounded-md'>
              <MailIcon strokeWidth={1.5} size={30} className='text-secondary/80' />
            </div>
            <div className='flex flex-col justify-start gap-2'>
              <h3 className=' font-bold text-xl'>Địa chỉ Email</h3>
              <p className='text-neutral-500 text-base'>hoang@ido-architects.com</p>
            </div>
          </div>

          <div className=' flex flex-col text-center md:flex-row justify-start items-center gap-4 mt-0 border-[1px] border-neutral-300 shadow-md p-8 hover:-translate-y-2 duration-500 cursor-pointer'>
            <div className='bg-primary/15 flex items-center justify-center h-16 w-16 px-4 rounded-md'>
              <Clock10 strokeWidth={1.5} size={30} className='text-secondary/80' />
            </div>
            <div className='flex flex-col justify-start gap-2'>
              <h3 className=' font-bold text-xl'>Giờ làm việc</h3>
              <p className='text-neutral-500 text-base'>Từ 8h sáng - 17h chiều</p>
            </div>
          </div>
        </motion.div>

        {/* social */}
        <motion.div 
        whileInView={{ opacity: 1 ,translateY:0}}
        initial={{ opacity: 0 ,translateY:100}} 
        viewport={{once:true}}
        transition={{duration:2}}
        className='my-5'>
          <h3 className='text-xl font-[700]'>Kết nối Social Media</h3>
          <p className='text-neutral-500'>Theo dõi và kết nối với Ido Architect tại </p>
          <div className='flex flex-row justify-start items-center gap-2 my-3'>
            <FacebookIcon className={className} />
            <X className={className}/>
            <InstagramLogoIcon className={className} />
            <LinkedInLogoIcon className= {className}/>
            
          </div>
        </motion.div>
      </div>

      {/* contactForm */}
      <motion.div 
      whileInView={{ opacity: 1 ,translateX:0}}
      initial={{ opacity: 0 ,translateX:100}} 
      viewport={{once:true}}
      transition={{duration:2}}
      className='hidden w-full md:flex justify-center'>
        <ContactForm 
        labelOfForm='Liên hệ đội ngũ chúng tôi'
        />
      </motion.div>
    </div>
    </>
  )
}

export default ContactComponent;