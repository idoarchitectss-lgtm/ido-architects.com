'use client'
import React, { Context, useContext, useEffect, useState } from 'react'
import Navbar from './navbar'
import Container from '@/components/custom/container'
import SocialInfo from './socialInfo'
import Logo from './logo'
import ContactInfo from './contactInfo'
import HambugerMenu from './hambugerMenu'
import { Switchbtn } from '../Switchbtn'
import SearchComponent from './search/SearchComponent'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
import { getAllPosts } from '@/lib/api'

import { motion, useScroll } from "framer-motion"

import { EdgesProps, PostsDataProps, PostsProps } from '@/types/typeForWordpressData'
import ConsultantBtn from '../buttons/ConsultantBtn'


interface HeaderProps {
  posts: EdgesProps[number]['node'][];
  logo: string;
}

type Edges = PostsDataProps['posts']

const Header: React.FC<HeaderProps> = ({ logo, posts }) => {
  const [newPosts, setNewPosts] = useState<EdgesProps[number]['node'][]>([])

  useEffect(() => {
    setNewPosts(posts)
  }, [posts, newPosts])

  return (
    <section className={`relative shadow-xl bg-primary text-white h-[25px] md:h-[90px] flex flex-row justify-between items-center py-9 px-2`}>
      <Container className='flex flex-row justify-between items-center w-full'>
        <div className='flex flex-row justify-center md:justify-between items-center gap-5 w-full'>
          <div className='flex-none w-[100px]'>
            <Logo
              className="w-full h-full"
              logo={logo}
            />
          </div>

          <div className='flex-auto w-full flex flex-row justify-end
           items-center gap-2 '>
            <Navbar />
            <SearchComponent className={`mx-2 `} posts={newPosts} />
            {/* <Switchbtn /> */}
            <div className='flex flex-row items-center gap-4 border-l-[1px] pl-10 '>
              <HambugerMenu />
              <ConsultantBtn />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Header