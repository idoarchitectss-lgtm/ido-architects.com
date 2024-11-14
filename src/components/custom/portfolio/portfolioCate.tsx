import React from 'react'


interface PortfolioCateProps {
    nameOfCategory: string;
    className?: string;
    handleClick?: ()=> void
}

const PortfolioCate:React.FC<PortfolioCateProps> = ({nameOfCategory, className,handleClick}) => {

  return (
   <h3 
   onClick={handleClick}
   className={`
   ${className}
   `}>
    {nameOfCategory}
    </h3>
  )
}

export default PortfolioCate