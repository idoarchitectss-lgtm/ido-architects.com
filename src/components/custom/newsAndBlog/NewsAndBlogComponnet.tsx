'use client'
import React, { Suspense } from 'react'
import Title from '../title'
import PostCard from './postCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { EdgesProps } from '@/types/typeForWordpressData';
import Loading from '@/app/loading';
import Container from '../container';

import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import MainButton from '../buttons/MainButton';

interface PostsProps {
  BlogPostsData: EdgesProps
}

const NewsAndBlogComponnet: React.FC<PostsProps> = ({
  BlogPostsData
}) => {

  const pathname = usePathname();

  return (
    <section className='max-h-min my-5 '>
      <div className='my-0 md:my-20 h-full flex flex-col justify-center items-center '>
        <div
          className='w-full'>
          <Title
            title='Kiến Thức'
            subtitle='NEWS'
            text=''
            islightBg
          />
        </div>
        <motion.div 
        initial={{ opacity: 0, translateX: 100 }}
        whileInView={{ opacity: 1, translateX: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className='max-w-[1200px] mx-auto  '>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className=' mx-auto'>
              {
                BlogPostsData?.map((post) => (
                  <CarouselItem key={post.node.slug}
                    className='basis-1/3 md:basis-2/3 lg:basis-1/3'
                  >
                    <PostCard
                      srcOfImg={post.node.featuredImage?.node.sourceUrl}
                      author={post.node.author.node.name}
                      publishedDate={post.node.date}
                      tagsList={post.node.tags?.nodes}
                      titleOfPost={post.node.title}
                      subtitleOfPost={post.node.excerpt}
                      link={`${pathname === '/blog' ? post.node.slug : `blog/${post.node.slug}`}`}
                    />
                  </CarouselItem>
                ))
              }
            </CarouselContent>
            <CarouselNext className='w-10 h-10 hidden lg:block border-none' />
            <CarouselPrevious className='w-10 h-10 hidden lg:block' />

          </Carousel>
        </motion.div>
        <motion.div 
        initial={{ opacity: 0, translateY: 100 }}
        whileInView={{ opacity: 1, translateY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className='w-full flex justify-center items-center'>
        <MainButton 
        labelOfButton='Xem thêm'
        href='/blog'
        />
        </motion.div>
      </div>
    </section >
  )
}

export default NewsAndBlogComponnet;