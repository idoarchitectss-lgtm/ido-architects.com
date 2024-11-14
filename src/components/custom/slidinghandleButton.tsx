import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import React from 'react'

interface SlidinghandleButtonProps {
    scrollLeftHandleFunction: () => void;
    scrollRightHandleFunction: () => void;
}

const SlidinghandleButton:React.FC<SlidinghandleButtonProps> = ({
    scrollLeftHandleFunction,
    scrollRightHandleFunction
}) => {
  return (
    <div className={`flex flex-row gap-3 justify-end items-center z-20
        `}>
              
                    <ArrowLeftCircle 
                         className='hidden md:block text-neutral-700 cursor-pointer hover:text-primary'
                        onClick={scrollLeftHandleFunction}
                    />
                    <ArrowRightCircle 
                        className=' hidden md:block  text-neutral-700 cursor-pointer hover:text-primary'
                        onClick={scrollRightHandleFunction}
                    />
              </div>
  )
}

export default SlidinghandleButton;