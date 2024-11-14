import { Mail, PhoneCall } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


const ContactInfo = () => {
  return (
    <div className='hidden md:block bg-[#002155] text-sm'>
      <div className='flex flex-row justify-center items-center gap-2'>
        <div className='text-white text-sm flex flex-row justify-center items-center  '>
          <div className='border-l-[0.5px] border-neutral-100/20 p-2 px-5 flex flex-row items-center gap-2 hover:text-secondary cursor-pointer duration-300'>
            <PhoneCall className=' p-[0.5px]' />
            <Link href="tel:+840974265929" className='font-medium text-sm'>+84 097 426 5929</Link>
          </div>
          <div className='border-x-[0.5px] border-neutral-100/20 p-2 px-5 flex flex-row items-center gap-2 hover:text-secondary cursor-pointer duration-300'>
            <Mail className=' p-[0.5px]' />
            <Link
              href='mailto:info@IDOarchitect.com'
              className='font-medium text-sm'>info@IDOarchitect.com</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo