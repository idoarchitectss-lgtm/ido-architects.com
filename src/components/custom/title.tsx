'use client'
import React, { useState } from 'react'

interface TitleProps {
  title: string;
  subtitle?: string;
  text?: string
  islightBg?: boolean;
  isLeftPosition?:boolean;
}

const Title: React.FC<TitleProps> = ({
  title,
  subtitle,
  text,
  islightBg,
  isLeftPosition

}) => {

  return (
    <div className={`w-12/12 mb-5 flex flex-col  
    ${isLeftPosition ? "items-start justify-end": "items-center justify-center "}
    `}>
      <div className={`
        ${isLeftPosition ? "items-start justify-start": "items-center justify-center mx-auto"}
        flex flex-col   w-12/12 md:w-9/12 gap-5`}>
        <p className={`text-secondary text-center md:text-left text-sm font-[700] leading-[16px] border-l-[2px] border-secondary inline-block pl-2 py-1
          `}>
          {subtitle}
        </p>
        <h2 className={`text-center text-[26px] lg:text-[32px] xl:text-[36px] 2xl:text-[40px] font-[600] leading-[30px] lg:leading-[40px] xl:leading-[46px]
          ${islightBg ? "" : "text-white"}
          `}>{title}
        </h2>
        <p className={`text-neutral-600 font-[600] text-[16px] leading-[32px] line-clamp-2 
          ${islightBg ? "text-neutral-400" : "text-white"}
          ${isLeftPosition ? "text-left": "text-center"}
        `}>
          {text}
        </p>
      </div>
    </div>
  )
}

export default Title