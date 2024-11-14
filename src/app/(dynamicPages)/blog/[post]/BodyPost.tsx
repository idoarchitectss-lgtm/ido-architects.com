'use client'
import { NodeProps } from '@/types/typeForWordpressData'
import React from 'react'

interface BodyPostProps {
    post:NodeProps
}

const BodyPost:React.FC<BodyPostProps> = ({
    post
}) => {
    
  return (
    <div>
      {/* <h2 className='text-3xl font-semibold text-secondary my-5'>{post?.title}</h2> */}
    <div className='bg-secondary/20 rounded-md py-4 px-3 my-5 italic'>
    <div dangerouslySetInnerHTML={{__html:post?.excerpt}}></div>
    </div>



    <div className='flex flex-col justify-start gap-1 break-words'
    dangerouslySetInnerHTML={{__html:post?.content}}></div>

    </div>
  )
}

export default BodyPost