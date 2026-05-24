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
import TouchToContact from '@/components/custom/TouchTocontact';
import BreadcrumbComponent from '@/components/custom/breadcrumb/BreadcrumbComponent';


const OurServicesPage = async () => {
  const data = await getServices();
  const edges = data.edges.map(edge => edge.node)
  const servicesArr = edges;
  // console.log(servicesArr)

  return (
    <main>
      <BackgroundForBreadcrumb
        titleForPage='Các dịch vụ tại IDO Architects'
      />
      <Container>
      <BreadcrumbComponent />
      </Container>
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
      <TouchToContact
        src="https://res.cloudinary.com/dskpdydeu/images/v1727844172/z5500051833314_36dda93a6e40150ab1a9d9b17cdf52f8-1/z5500051833314_36dda93a6e40150ab1a9d9b17cdf52f8-1.jpg"
        labelOfForm="Liên hệ chúng tôi"
      />
    </main>
  )
}

export default OurServicesPage