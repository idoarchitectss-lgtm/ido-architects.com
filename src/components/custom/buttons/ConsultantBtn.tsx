import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const ConsultantBtn = () => {
  return (
    <div className='hidden md:block relative w-full cursor-pointer'>
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-50 z-0"></span>
        <Button variant={'outline'} className='rounded-full bg-secondary'>
            <Link href={"/contact"}>
            Liên hệ tư vấn
            </Link>
        </Button>
    </div>
  )
}

export default ConsultantBtn