import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface LogoProps {
  logo: string;
}

const Logo = ({logo}:LogoProps) => {
  return (
    <Link 
    href="/"
    className='text-xl font-semibold'>
      {/* <span className='text-secondary font-bold text-2xl'>IDO</span> Architects */}
      <Image 
      src={logo}
      alt='IDO-Architects'
      width={1000}
      height={1000}
      className='object-cover w-20 h-20'
      />
    </Link>
  )
}

export default Logo;