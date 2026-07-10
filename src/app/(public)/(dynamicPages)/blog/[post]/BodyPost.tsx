'use client'
import { NodeProps } from '@/types/typeForWordpressData'
import React from 'react'
import TiptapContent from '@/components/custom/tiptap/TiptapContent'
import { processHeadings } from '@/components/custom/tiptap/heading-utils'

interface BodyPostProps {
    post:NodeProps
}

const BodyPost:React.FC<BodyPostProps> = ({
    post
}) => {
    const { html: content } = processHeadings(post?.content ?? '')

  return (
    <div>
    <div className='bg-secondary/20 rounded-md py-4 px-3 my-5 italic'>
    <div dangerouslySetInnerHTML={{__html:post?.excerpt}}></div>
    </div>
    <TiptapContent html={content} />
    </div>
  )
}

export default BodyPost