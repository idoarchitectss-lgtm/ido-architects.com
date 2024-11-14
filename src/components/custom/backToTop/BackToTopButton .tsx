'use client'
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';


const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToDiv = (targetId: string) => {
    // Use document.getElementById to get the target element
    const targetElement = document.getElementById(targetId);
    // Check if the target element exists
    if (targetElement) {
      // Use targetElement.scrollIntoView({ behavior: 'smooth' }) to scroll to the element
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error(`Element with ID "${targetId}" not found.`);
    }
  };

  return (
    <button
      className={`back-to-top-button bg-secondary w-10 h-10 fixed z-50 bottom-10 right-5 rounded-full
        ${showButton ? 'block' : 'hidden'}`}
      onClick={() => handleScrollToDiv('topPage')} // Pass the target ID 
    >
      <i className="fas fa-arrow-up"></i>
      <span className='relative text-white flex flex-row justify-center'>
        <ArrowUp />
        <span className="absolute -top-[20px] -right-[28px] flex h-3 w-3 -translate-x-5">
          <span className="animate-ping absolute inline-flex h-14 w-14 -right-0 -top-0 rounded-full bg-secondary opacity-75"></span>
          {/* <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span> */}
        </span>
      </span>
    </button>
  )
}

export default BackToTopButton 