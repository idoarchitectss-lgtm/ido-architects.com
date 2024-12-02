import classNames from 'classnames';
import Image from 'next/image'
import React from 'react'

interface ValueItemProps {
    icon:string;
    title:string;
    text:string;
    classNames?:string | null | undefined;
}

const ValueItem:React.FC<ValueItemProps> = ({
    icon,title,text,classNames
}) => {
  return (
    <div className={`${classNames} w-[80%] mx-auto flex flex-col items-center justify-center gap-2 p-5`}>
        <Image
        src={icon}
        alt={title}
        width={2000}
        height={2000}
        className='object-cover w-24 h-24' 
        />
       <h3 className='font-[700] text-xl'>{title}</h3>
       <p className='text-neutral-500'>{text}</p>
    </div>
  )
}

export default ValueItem