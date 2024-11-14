import classNames from 'classnames';
import Link from 'next/link'
import React from 'react'

interface MainButtonProps {
    slug: string;
    label: string;
    isSecondaryStyle?: boolean;
    className?:string | undefined | null;
}
const MainButton:React.FC<MainButtonProps> = ({
    slug,
    label,
    isSecondaryStyle,
    className
}) => {
    return (
        <Link href={slug}
            className={`${className}  group relative flex flex-row justify-center items-center text-white font-semibold text-sm  p-4 mt-5 duration-300 
            ${isSecondaryStyle ? 'bg-secondary hover:bg-primary': ' bg-primary hover:bg-secondary'}
            `}>
            <div className='flex-auto opacity-0 scale-x-0 group-hover:scale-x-100 group-hover:opacity-100  border-b-[2px] border-white w-6/12 duration-500 my-3'>
            </div>
            <span 
            className={`text-white flex-none group-hover:translate-x-[45%] duration-500 z-10
            `}>
                {label}
            </span>
            <div className='flex-auto group-hover:opacity-0 translate-x-2  border-b-[2px] border-white w-6/12 duration-500'></div>
            {/* <StepForward size={14} className='absolute left-[47%]'/> */}
        </Link>
    )
}

export default MainButton