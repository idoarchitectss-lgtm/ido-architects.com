import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const MainButton = ({href,labelOfButton}:{href:string,labelOfButton:string}) => {
    return (
        <Button
            size='xl'
            className='flex flex-row items-center justify-center gap-2 shadow-md w-full md:w-6/12 lg:w-3/12 max-w-[200px] hover:bg-secondary group mt-10 duration-500 py-2'>
            <Link href={href}
                className='text-sm text-secondary group-hover:translate-x-2 group-hover:text-white duration-500'>
                {labelOfButton}
            </Link>
            <ChevronRight className='w-7 h-7 rotate-90 group-hover:rotate-0 opacity-70 group-hover:opacity-100 duration-500  text-primary group-hover:text-white' />
        </Button>
    )
}

export default MainButton