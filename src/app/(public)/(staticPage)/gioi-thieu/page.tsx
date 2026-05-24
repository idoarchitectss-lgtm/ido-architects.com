import BackgroundForBreadcrumb from '@/components/custom/BackgroundForBreadcrumb';
import Consultant from '@/components/custom/Consultant';
import Container from '@/components/custom/container';
import Feelback from '@/components/custom/feelback/feelback';
import NumberOfAchievements from '@/components/custom/NumberOfAchievements';
import OfferServices from '@/components/custom/offerServices/offerServices';
import ServiceCarousel from '@/components/custom/offerServices/ServiceCarousel';
import SlogansComponent from '@/components/custom/SlogansComponent';
import TouchTocontact from '@/components/custom/TouchTocontact';
import ValuesComponent from '@/components/custom/values/ValuesComponent';
import { allServices } from '@/data/datafromWP';
import IntroductionAboutCompany from './IntroductionAboutCompany';
import BreadcrumbComponent from '@/components/custom/breadcrumb/BreadcrumbComponent';

const companyInfo = {
  title: "Dự án của Ido Architects là sự kết hợp giữa nghệ thuật kiến trúc và công năng sử dụng",
  img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  text: "",
}

const AboutUsPage = async () => {
  const servicesArr = await allServices();

  const { title, img, text, } = companyInfo
  return (
    <div className='relative overflow-hidden'>

      <div className='relative w-full'>
        <BackgroundForBreadcrumb
          titleForPage='Về chúng tôi'
        />
        <Container>
                <BreadcrumbComponent />
            </Container>
        <div className='h-[500px] lg:h-[300px]'>
          <div className='lg:absolute lg:-bottom-48 left-0 w-full h-full flex justify-center items-center'>
            <NumberOfAchievements />
          </div>
        </div>
      </div>
      <div className='lg:bg-secondary py-10'>
        <Container>
          <IntroductionAboutCompany
            title={title}
            img={img}
          />
        </Container>
      </div>

      {/* Giá trị cốt lõi */}
      <ValuesComponent />
      {/* Slogans of Enterprise */}
      <SlogansComponent />
      {/* Lĩnh vực hoạt động */}
      <OfferServices servicesArr={servicesArr} />
      {/* Doanh nghiệp cam kết */}
      <Consultant />
      <Feelback />
      <TouchTocontact

        src='https://res.cloudinary.com/dskpdydeu/images/v1727844172/z5500051833314_36dda93a6e40150ab1a9d9b17cdf52f8-1/z5500051833314_36dda93a6e40150ab1a9d9b17cdf52f8-1.jpg'
        labelOfForm='Đặt lịch tư vấn'
      />

    </div>
  )
}

export default AboutUsPage;