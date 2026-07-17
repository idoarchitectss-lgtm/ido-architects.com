import { Button } from '@/components/ui/button'
import { Bell, BellElectric } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ConsultantBtn = () => {
  return (
    <div className='hidden md:block relative w-full cursor-pointer'>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-40 z-0"></span>
      <Button variant={'cta'} size={'default'}
        className='relative z-10 '>
        <Link href={"/lien-he"} className='px-1 flex justify-center items-center gap-2'>
          <Bell className='w-5 h-5' strokeWidth={2}/>
          <span>
            Báo giá thiết kế
          </span>
        </Link>
      </Button>
    </div>
  )
}

export default ConsultantBtn