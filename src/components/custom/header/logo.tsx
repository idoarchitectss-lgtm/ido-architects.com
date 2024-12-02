import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

interface LogoProps {
  logo: string;
  className?:string | null |undefined;
}

const Logo = ({logo,className}:LogoProps) => {
  return (
    <Link 
    href="/"
    className={`${className} text-xl font-semibold`}>
      {/* <span className='text-secondary font-bold text-2xl'>IDO</span> Architects */}
      <Image 
      src={logo}
      alt='IDO-Architects'
      width={1000}
      height={1000}
      className='object-cover w-full h-full'
      />
    </Link>
  )
}

export default Logo;