import { FeelbackItemProps } from '@/types/interface'
import Image from 'next/image'
import React from 'react'

import { motion } from "framer-motion"


const FeelbackItem = ({feelback}:{ feelback:FeelbackItemProps}) => {

    const {urlFeaturedImage, nameOfAuthor, jobOfAuthor, commentOfAuthor} = feelback

    return (
        <motion.div 
        animate={{ translateX:-1000}}
        transition={{
            repeat: Infinity,
            duration: 15,
        }}
        className="group w-11/12 md:w-12/12 h-[300px] bg-primary/80 hover:bg-secondary mx-auto rounded-lg p-2 px-5 flex flex-col justify-center items-center cursor-pointer duration-300">
            <div className="w-full rounded-lg text-white">
                <div className="flex flex-col justify-center items-center gap-4 p-5">
                    {/* reviewer picture and job */}
                    <div className="flex flex-1 flex-row justify-start items-center gap-3">
                        <Image
                            src={urlFeaturedImage}
                            alt={nameOfAuthor}
                            width={800}
                            height={600}
                            className="object-cover rounded-full flex-none w-[50px] h-[50px]"
                        />
                        <div className="flex-none w-12/12 flex-row md:flex-col justify-center items-center">
                            <h4 className="font-[600] text-[24px]">{nameOfAuthor}</h4>
                            <p>{jobOfAuthor}</p>
                        </div>
                    </div>
                    {/* rating */}
                    <div className="flex-1 flex flex-row justify-start items-center gap-1">
                        {/* <Star className="hover:-translate-y-1 duration-300" />
                        <Star className="hover:-translate-y-1 duration-300" />
                        <Star className="hover:-translate-y-1 duration-300" />
                        <Star className="hover:-translate-y-1 duration-300" />
                        <Star className="hover:-translate-y-1 duration-300" /> */}
                        <p>Đánh giá
                        </p>
                        <p className='text-secondary font-bold'>5/5</p>

                    </div>
                    {/* comment content */}
                    <div className="flex flex-row justify-start items-start my-4 px-5">
                        <p className="line-clamp-3">
                            {commentOfAuthor}
                        </p>
                    </div>
                </div>

            </div>
        </motion.div>
    )
}

export default FeelbackItem