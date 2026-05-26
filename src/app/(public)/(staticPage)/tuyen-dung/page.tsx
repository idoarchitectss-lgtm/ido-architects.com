import BackgroundForBreadcrumb from '@/components/custom/BackgroundForBreadcrumb';
import BreadcrumbComponent from '@/components/custom/breadcrumb/BreadcrumbComponent';
import Container from '@/components/custom/container';
import TouchTocontact from '@/components/custom/TouchTocontact';
import { recruitPageStatic } from '@/data/staticData';

const RecruitPage = () => {
  const res = recruitPageStatic();

  return (
    <div className='my-10'>
      <BackgroundForBreadcrumb titleForPage='Ido Architects tuyển dụng các vị trí công việc' />
      <Container>
        <BreadcrumbComponent />
        <div>
          <div dangerouslySetInnerHTML={{ __html: res.page.content }}></div>
        </div>
        <TouchTocontact
          src="https://res.cloudinary.com/dskpdydeu/images/v1727844172/z5500051833314_36dda93a6e40150ab1a9d9b17cdf52f8-1/z5500051833314_36dda93a6e40150ab1a9d9b17cdf52f8-1.jpg"
          labelOfForm="Liên hệ chúng tôi"
        />
      </Container>
    </div>
  );
};

export default RecruitPage;
