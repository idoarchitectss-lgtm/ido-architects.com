'use client'
import Image from 'next/image';
import React from 'react'
import Link from 'next/link';
import PostMeta from './PostMeta';
import { DEFAULT_AUTHOR_NAME } from '@/lib/constants';
import { motion } from "framer-motion"
import { usePathname } from 'next/navigation';
import { transcode } from 'buffer';


interface PostCardProps {
  srcOfImg?: string;
  author?: string;
  publishedDate?: string;
  tagsList?: {
    name: string;
    slug: string;
  }[];
  titleOfPost: string;
  subtitleOfPost?: string;
  link: string;
}

const PostCard: React.FC<PostCardProps> = ({
  srcOfImg,
  author,
  publishedDate,
  tagsList,
  titleOfPost,
  subtitleOfPost,
  link
}) => {
  return (
    <div
    className={`rounded-md group w-12/12 max-h-min flex flex-col justify-start overflow-hidden`}>
      <Link 
      href={link}
      className='overflow-hidden w-full h-[250px]'>
        <Image
          src={srcOfImg || ''}
          alt={titleOfPost}
          width={1200}
          height={800}
          className='object-cover w-full scale-x-110 h-full group-hover:-translate-x-4 duration-300 cursor-pointer'
        />
      </Link>
      <PostMeta
        author={author || DEFAULT_AUTHOR_NAME}
        publishedDate={publishedDate || "Đang cập nhật"}
        tagsList={tagsList || [{ name: "Chưa phân loại", slug: "" }]}
      />

      <div className=' pb-4'>
        <Link href={link}>
          <h2 className=' text font-[600] text-[18px] group-hover:text-secondary line-clamp-1 cursor-pointer duration-300'>{titleOfPost}</h2>
        </Link>
        {/* <div className='text-neutral-600 text-[16px] line-clamp-2' dangerouslySetInnerHTML={{ __html: subtitleOfPost || "" }} ></div> */}
        <Link href={link}
          className='hover:text-secondary'
        >
          <p className='mt-2 text-neutral-600  text-base group-hover:translate-x-2 duration-300'>
            Đọc thêm
          </p>
        </Link>
      </div>

    </div>
  )
}

export default PostCard