import classNames from 'classnames';
import { Facebook, Github, GithubIcon, InstagramIcon, Mail, MailIcon, MapPinIcon, Tag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface SocialInfoProps{
isHorizontal?:boolean;
classNames?:string | null | undefined;
}
const SocialInfo:React.FC<SocialInfoProps> = ({isHorizontal, classNames}) => {
  return (
    <div className={`bg-primary text-sm ${classNames}`}>
      <div className='flex flex-row justify-center items-center gap-2'>
        <div className={` text-sm flex  justify-center items-center `
    + (isHorizontal ?  "flex-row text-secondary" : "flex-col text-white")
        }>
          <Link
            href="https://www.facebook.com/ido.architectss"
            className='border-l-[0.5px] border-neutral-100/20 p-2'>
            <Facebook className='hover:text-secondary cursor-pointer duration-300 p-[3px] mx-2' />
          </Link>
          <Link
            href="mailto:hoang@ido-architects.com"
            className='border-l-[0.5px] border-neutral-100/20 p-2 '>
            <Mail className='hover:text-secondary cursor-pointer duration-300 p-[3px] mx-2' />
          </Link>
          <Link
            href="https://www.instagram.com/idoarchitects/"
            className='border-x-[0.5px] border-neutral-100/20 p-2'>
            <InstagramIcon className='hover:text-secondary cursor-pointer duration-300 p-[3px] mx-2' />
          </Link>

        </div>
      </div>
    </div>
  )
}

export default SocialInfo