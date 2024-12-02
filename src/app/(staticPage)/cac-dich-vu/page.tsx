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
        src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/466628780_1089355346529712_4375042002829101583_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG0QwlHrYt7oI_jpuCBWbQ1h3yFPRoKS0mHfIU9GgpLSWgB8dRYnR08IRI2vnt1oAZsPbLdqqfZWqAdZK4ddMTX&_nc_ohc=OOJt-cAco4kQ7kNvgHwYhvn&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=ARNaer0iUjXfFGrpFSNIGWn&oh=00_AYD_ngcEvzqqKi5Z6s2WWgSs7TgDgQRQzN1t9pGk_2TNxg&oe=6743C4EA"
        labelOfForm="Liên hệ với đội ngũ chúng tôi"
      />
    </main>
  )
}

export default OurServicesPage