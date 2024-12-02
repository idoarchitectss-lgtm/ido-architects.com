'use client'
import Image from 'next/image';
import React from 'react'
import Link from 'next/link';
import PostMeta from './PostMeta';
import { DEFAULT_AUTHOR_NAME } from '@/lib/constants';
import { motion } from "framer-motion"
import { usePathname } from 'next/navigation';
import { transcode } from 'buffer';
import { Card } from '@/components/ui/card';


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
    <div className=' w-full h-full'>
    <Card
        className='w-full group rounded-none shadow-md h-full'>
        <div className='relative w-full h-[200px]  overflow-hidden'>
            <Link href={link}>
            <Image
                src={srcOfImg || "https://cdn.stocksnap.io/img-thumbs/960w/scenic-landscape_WPPJNTMEAX.jpg"}
                alt={titleOfPost}
                width={1200}
                height={800}
                className='w-full h-full object-cover  group-hover:scale-105 duration-500 cursor-pointer'
                />
              </Link>
        </div>
        <div className='  py-2 text-neutral-700 group-hover:text-secondary px-5 duration-500'>
        <Link href={link}>
            <h3 className='line-clamp-2 text-lg font-[500] text-center'>{titleOfPost}</h3>
            </Link>
        </div>

    </Card>
</div>
  )
}

export default PostCard