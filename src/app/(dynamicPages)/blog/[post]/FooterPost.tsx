'use client'
import PostCard from '@/components/custom/newsAndBlog/postCard';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { NodeProps, PostsProps } from '@/types/typeForWordpressData'
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
interface FooterPostProps {
  relevantPosts: PostsProps
}

const FooterPost: React.FC<FooterPostProps> = ({
  relevantPosts
}) => {
  const [newPosts, setNewPosts] = useState<PostsProps['edges'][number]['node'][]>([])
  const pathname = usePathname()

  useEffect(() => {
    const { edges, pageInfo } = relevantPosts; 
    const posts = edges.map((edge) => edge.node)
    const segmentsArr = pathname?.split('/').filter(Boolean)
    const currentSlug = segmentsArr?.[1]
    const morePosts = posts.filter((post) => post.slug !== currentSlug).map(item => item)
    setNewPosts(morePosts)
  
  }, [pathname,relevantPosts,])

  return (
    <div className='mb-10'>
      <Carousel>
        <CarouselContent className='flex flex-row'>
          {newPosts?.map((post) => (
            <CarouselItem 
            className='basis-full md:basis-1/2 xl:basis-1/3'
            key={post.slug}>
              <PostCard
                srcOfImg={post.featuredImage?.node.sourceUrl}
                author={post.author?.node.name}
                publishedDate={post.date}
                titleOfPost={post?.title}
                subtitleOfPost={post?.excerpt}
                tagsList={post?.tags?.nodes}
                link={post?.slug}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default FooterPost