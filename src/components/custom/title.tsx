'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface TitleProps {
  title: string;
  subtitle?: string;
  text?: string
  islightBg?: boolean;
  isLeftPosition?: boolean;
}

const Title: React.FC<TitleProps> = ({
  title,
  subtitle,
  text,
  islightBg,
  isLeftPosition

}) => {

  return (
    <motion.div
      initial={{ opacity: 0, }}
      whileInView={{ opacity: 1, }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className={`w-full mb-5 flex flex-col lg:w-[70%] mx-auto
    ${isLeftPosition ? "items-start justify-end" : "items-center justify-center "}
    `}>
      <div className={`
        ${isLeftPosition ? "items-start justify-start" : "items-center justify-center mx-auto"}
        flex flex-col   w-12/12 md:w-9/12 gap-5`}>
        <p className={`text-secondary text-center md:text-left text-sm font-[700] border-l-[2px] border-secondary inline-block pl-2 py-1
          `}>
          {subtitle}
        </p>
        <h2 className={`text-center text-[40px] lg:text-[49px] font-[700] 
          ${islightBg ? "" : "text-white"}
          `}>{title}
        </h2>
        <p className={`text-neutral-600 font-[600] text-[16px] line-clamp-2 
          ${islightBg ? "text-neutral-400" : "text-white"}
          ${isLeftPosition ? "text-left" : "text-center"}
        `}>
          {text}
        </p>
      </div>
    </motion.div>
  )
}

export default Title