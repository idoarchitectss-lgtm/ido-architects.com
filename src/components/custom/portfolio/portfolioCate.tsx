import React from 'react'


interface PortfolioCateProps {
    nameOfCategory: string;
    className?: string;
    handleClick?: ()=> void
}

const PortfolioCate:React.FC<PortfolioCateProps> = ({nameOfCategory, className,handleClick}) => {

  return (
   <div 
   onClick={handleClick}
   className={`
   ${className}
   `}>
    <h3>
    {nameOfCategory}
    </h3>
    </div>
  )
}

export default PortfolioCate