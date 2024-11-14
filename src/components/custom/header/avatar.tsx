import { CircleUserRound } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const avatar = () => {
  return (
    <div className='bg-neutral-300 rounded-full p-1'>
<CircleUserRound strokeWidth={1.5} size={24}/>
    </div>
    
  )
}

export default avatar