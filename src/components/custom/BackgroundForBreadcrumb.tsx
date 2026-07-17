'use client'
import BreadcrumbComponent from './breadcrumb/BreadcrumbComponent'
import { usePathname } from 'next/navigation'
import Container from './container';

interface BackgroundForBreadcrumbProps {
  titleForPage:string;
}

const BackgroundForBreadcrumb:React.FC<BackgroundForBreadcrumbProps> = ({
  titleForPage
}) => {
  // const pathname = usePathname()
  // const segments = pathname?.split('/')
  // const titleForPage = segments[1]
  return (
    <div className='relative h-[35vh] md:h-[55vh]'
    style={{ 
      backgroundImage: "url(/image/2027/hero-2.jpg)",
      backgroundRepeat: "no-repeat", backgroundSize: "cover", 
      backgroundPosition: "center"
     }}
  >
    <div className='absolute top-0 left-0 w-full h-full bg-black/50'>
      <div className='w-full h-full flex flex-col justify-center items-center text-white'>
        <h2 className='text-3xl md:text-5xl font-[700] text-white uppercase text-center'>{titleForPage}</h2>
      </div>
    </div>
  </div>
  )
}

export default BackgroundForBreadcrumb;