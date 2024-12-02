'use client'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React from 'react'

const Consultant = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div
    className='h-[350px] w-full relative'
    style={{
        backgroundImage:"url('https://images.unsplash.com/photo-1527127677991-75e63806db45?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundPosition:"center",
        backgroundSize:'cover',
        backgroundAttachment:'fixed'
    }}
    >
        <div className='absolute top-0 left-0 w-full h-full bg-black/75 flex justify-center items-center'>
                <div className='flex flex-col text-center w-full md:w-[600px] lg:w-[800px] gap-5 px-4'>
                <h2 className='text-secondary text-3xl font-bold'>NHẬN BÁO GIÁ & TƯ VẤN</h2>
                <p className='text-white text-base '>"Nếu bạn vẫn đang khó khăn với việc tìm kiếm và lựa chọn công ty Kiến trúc phù hợp với mình. Hãy chọn <span className='font-bold'>Ido Architects</span> bởi chúng tôi luôn lắng nghe, thấu hiểu và tự hào là người bạn đồng hành giúp khách hàng có được những dự án mang giá trị cao nhất."</p>
               <div 
               
               onClick={()=> router.push(`${pathname}#touch-to-contact`)}
               className='flex flex-col justify-center items-center'>
                <ChevronDown  
                className='text-secondary opacity-100 w-14 h-14 arrow'/>
               </div>
                </div>
        </div>
    </div>
  )
}

export default Consultant