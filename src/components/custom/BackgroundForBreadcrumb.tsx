'use client'
import BreadcrumbComponent from './breadcrumb/BreadcrumbComponent'
import { usePathname } from 'next/navigation'

const BackgroundForBreadcrumb = () => {
  const pathname = usePathname()
  const segments = pathname?.split('/')
  const titleForPage = segments[1]
  return (
    <div className='relative h-[35vh]'
    style={{ 
      backgroundImage: "url(https://images.pexels.com/photos/1143416/pexels-photo-1143416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)", 
      backgroundRepeat: "no-repeat", backgroundSize: "cover", 
      backgroundPosition: "center"
     }}
  >
    <div className='absolute top-0 left-0 w-full h-full bg-primary/85'>
      <div className='w-full h-full flex flex-col justify-center items-center text-white'>
        <h2 className='text-5xl font-[700] text-white uppercase'>{titleForPage}</h2>
        <BreadcrumbComponent />
      </div>
    </div>
  </div>
  )
}

export default BackgroundForBreadcrumb;