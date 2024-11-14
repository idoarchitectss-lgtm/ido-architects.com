'use client'
import React, { Context, useContext, useEffect, useState } from 'react'
import Navbar from './navbar'
import Container from '@/components/custom/container'
import SocialInfo from './socialInfo'
import Logo from './logo'
import ContactInfo from './contactInfo'
import HambugerMenu from './hambugerMenu'
import {Switchbtn} from '../Switchbtn'
import SearchComponent from './search/SearchComponent'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
import { getAllPosts } from '@/lib/api'

import { motion, useScroll } from "framer-motion"

import { EdgesProps, PostsDataProps, PostsProps } from '@/types/typeForWordpressData'


interface HeaderProps {
  posts: EdgesProps[number]['node'][];
  logo: string;
}

type Edges = PostsDataProps['posts']

const Header: React.FC<HeaderProps> = ({ logo,posts }) => {
  const [newPosts, setNewPosts] = useState<EdgesProps[number]['node'][]>([])
  
  /** Disabled fix menu according to scroll */

  // const [scrollPositionY, setScrollPositionY] = useState({ top: 0 })

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const newScrollPositionY = {
  //       top: window.scrollY || document.documentElement.scrollTop
  //     };
  //     setScrollPositionY(newScrollPositionY);
  //     // console.log(newScrollPositionY)
  //   }
  //   window.addEventListener("scroll", handleScroll)
  // }, [scrollPositionY])
/**
 * Nếu dùng thì bỏ code này xuống section bên dưới
 *  ${scrollPositionY.top > 200 && scrollPositionY.top < 9000 ? "fixed scroll-smooth top-0 w-full z-50 duration-300  " : ""}
 * 
 */
  useEffect(() => {
    setNewPosts(posts)
    // console.log("checknewposts",newPosts)
  }, [posts, newPosts])

  const { scrollYProgress } = useScroll();

  return (
    <section className={`relative shadow-md 
    `}>
      <div className=' bg-primary'>
        <Container>
          <div className='flex flex-row justify-between w-12/12 mx-auto'>
            <SocialInfo isHorizontal />
            <ContactInfo />
          </div>
        </Container>
      </div>
      <Container>
        <div className='flex flex-row justify-between items-center gap-5 py-5'>
          <Logo 
          logo={logo}
          />
          <div className='flex flex-row items-center gap-2'>
            <Navbar 
            />
            <SearchComponent className={`mx-2`} posts={newPosts} />
            <Switchbtn />
            <div className='flex flex-row items-center gap-4 border-l-[1px]  pl-4 '>
              <HambugerMenu />
            </div>
          </div>
        </div>
      </Container>
      <motion.div 
            className="progress-bar"
            style={{ scaleX: scrollYProgress }} />
    </section>
  )
}

export default Header