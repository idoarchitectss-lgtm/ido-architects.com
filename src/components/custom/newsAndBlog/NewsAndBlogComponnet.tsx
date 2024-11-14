'use client'
import React, { Suspense } from 'react'
import Title from '../title'
import PostCard from './postCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { EdgesProps } from '@/types/typeForWordpressData';
import Loading from '@/app/loading';
import MainButton from '../mainButton';
import Container from '../container';

import {motion} from "framer-motion";
import { usePathname } from 'next/navigation';

interface PostsProps {
  BlogPostsData: EdgesProps
}

const NewsAndBlogComponnet: React.FC<PostsProps> = ({
  BlogPostsData
}) => {

  const pathname = usePathname();

  return (
    <section className='max-h-min my-5'>
      <div className='my-0 md:my-20 h-full '>
        <motion.div 
        initial={{opacity:0}}
        whileInView={{opacity:1}}
        viewport={{once:true}}
        transition={{duration:1, type:"spring"}}
        className='pt-10 px-2'>
          <Title
            title='Blog mới nhất của chúng tôi'
            subtitle='Bài viết và tin tức nổi bật'
            text=''
            islightBg
          />
        </motion.div>
          <div className='w-11/12 md:w-10/12 xl:w-8/12 mx-auto'>
            <Carousel>
              <CarouselContent className=''>
                {
                  BlogPostsData?.map((post) => (
                    <CarouselItem key={post.node.slug}
                      className=' basis-full md:basis-2/3 lg:basis-1/4 mx-2 '
                    >
                      <PostCard
                        srcOfImg={post.node.featuredImage?.node.sourceUrl}
                        author={post.node.author.node.name}
                        publishedDate={post.node.date}
                        tagsList={post.node.tags?.nodes}
                        titleOfPost={post.node.title}
                        subtitleOfPost={post.node.excerpt}
                        link={`${pathname === '/blog' ? post.node.slug :`blog/${post.node.slug}`}`}
                      />
                    </CarouselItem>
                  ))
                }
              </CarouselContent>
              <CarouselNext className='w-10 h-10 hidden lg:block' />
              <CarouselPrevious className='w-10 h-10 hidden lg:block' />
              <div className='lg:hidden bg-gradient-to-l from-neutral-100 to-transparent h-full w-24 absolute top-0 right-0 translate-x-5'>
              </div>
            </Carousel>
          </div>
          <MainButton
            className='w-10/12 md:w-8/12 lg:w-4/12 xl:w-3/12 mx-auto'
            slug='/blog'
            label='Tất cả bài viết'
          />
      </div>
    </section >
  )
}

export default NewsAndBlogComponnet;