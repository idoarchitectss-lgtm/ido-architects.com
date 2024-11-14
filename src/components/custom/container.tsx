import React from 'react'

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

const Container:React.FC<ContainerProps> = ({
    children,
    className
}) => {
  return (
    <div className={`w-12/12 lg:w-11/12 xl:w-10/12 2xl:w-8/12 px-2 md:px-4 min-w-screen max-w-[1440px] mx-auto  ${className}`}>
      {children}
    </div>
  )
}

export default Container