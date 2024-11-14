import BackgroundForBreadcrumb from '@/components/custom/BackgroundForBreadcrumb'
import Container from '@/components/custom/container'
import ContactForm from '@/components/custom/forms/ContactForm';
import OfferServices from '@/components/custom/offerServices/offerServices'
import { getServices } from '@/lib/api';
import { Services } from '@/types/typeForWordpressData';
import Image from 'next/image';
import FQAComponent from './FQA';
import Title from '@/components/custom/title';
import { Suspense } from 'react';
import Loading from '@/app/loading';


// type servicesArr = Services['edges'][number]['node']
// export async function AllServices() {
//   const data = await getServices();
//   const edges = data.edges.map(edge => edge.node)
//   // console.log("check services>>>>",edges)
//   return edges;
// }

const OurServicesPage = async () => {
  const data = await getServices();
  const edges = data.edges.map(edge => edge.node)
  const servicesArr = edges;
  // console.log(servicesArr)

  return (
    <main>
      <BackgroundForBreadcrumb />
      <Suspense fallback={<Loading />}>
        <OfferServices servicesArr={servicesArr} />
      </Suspense>
      <Container>
        <div className='my-5 md:my-10'>
          <Title
            islightBg
            title='FAQ'
            subtitle='Những câu hỏi thường gặp'
          />
          <FQAComponent />
        </div>
      </Container>
      <div className='hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500 to-secondary lg:flex justify-center items-center'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-14 max-w-[1440px] min-w-max mx-auto'>
          <div className="col-span-2 overflow-hidden">
            <Image
              src='https://images.pexels.com/photos/4491459/pexels-photo-4491459.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
              alt='our-services'
              width={1000}
              height={1000}
              className='w-full h-full object-cover cursor-pointer hover:scale-125 duration-500'
            />
          </div>
          <div className='col-span-1 w-full py-10'>
            <ContactForm
              btnColor='bg-primary hover:bg-primary/90'
            />
          </div>
        </div>
      </div>
      <div className='lg:hidden mt-20 h-[800px] g-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500 to-secondary'>
        <Container>
          <div className='flex flex-row justify-around items-center gap-20 py-20 '>
            <div className='w-full lg:w-5/12 flex justify-center items-center'>
              <ContactForm
                btnColor='bg-primary hover:bg-primary/90'
              />
            </div>
          </div>
        </Container>
      </div>

    </main>
  )
}

export default OurServicesPage